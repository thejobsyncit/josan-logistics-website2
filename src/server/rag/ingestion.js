/**
 * Document Ingestion Pipeline for RAG
 * Pipeline: File Upload -> Text Extraction -> Chunking -> Embedding -> Database Indexing
 */

import { supabase, isSupabaseConfigured } from '../../services/supabase.js';
import { extractTextFromFile } from './textExtractor.js';
import { chunkDocument } from './chunker.js';
import { generateEmbedding } from './embeddings.js';

export async function ingestDocument({ fileBuffer, fileName, fileType, title, category = 'General', description = '' }) {
  const docTitle = title || fileName.replace(/\.[^/.]+$/, '');
  const documentId = crypto.randomUUID();

  // 1. Extract text from buffer
  let text = '';
  try {
    text = await extractTextFromFile(fileBuffer, fileName, fileType);
  } catch (err) {
    return {
      success: false,
      error: `Text extraction failed: ${err.message}`
    };
  }

  if (!text || text.trim().length < 10) {
    return {
      success: false,
      error: 'Extracted document text is empty or unreadable.'
    };
  }

  // 2. Split text into overlapping semantic chunks
  const chunks = chunkDocument(text, {
    chunkSize: 600,
    chunkOverlap: 120,
    documentId,
    fileName
  });

  if (chunks.length === 0) {
    return {
      success: false,
      error: 'Failed to split document into readable text chunks.'
    };
  }

  // 3. Generate embeddings for all chunks
  const chunkDataList = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content);
    chunkDataList.push({
      id: crypto.randomUUID(),
      document_id: documentId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      token_count: chunk.tokenCount,
      embedding,
      metadata: chunk.metadata
    });
  }

  // 4. Save Master Document Record & Chunks in Supabase if available
  if (isSupabaseConfigured) {
    try {
      // Insert Master Document
      const { error: docErr } = await supabase
        .from('documents')
        .insert([{
          id: documentId,
          file_name: fileName,
          file_type: fileType || 'pdf',
          title: docTitle,
          description: description || `Ingested ${chunks.length} chunks from ${fileName}`,
          category,
          chunk_count: chunks.length,
          status: 'COMPLETED',
          metadata: {
            total_characters: text.length,
            chunk_size: 600,
            ingested_at: new Date().toISOString()
          }
        }]);

      if (docErr) {
        console.warn('[IngestionPipeline] Document record insert warning:', docErr.message);
      }

      // Insert Chunks in batches of 50
      for (let i = 0; i < chunkDataList.length; i += 50) {
        const batch = chunkDataList.slice(i, i + 50);
        const { error: chunkErr } = await supabase
          .from('document_chunks')
          .insert(batch);

        if (chunkErr) {
          console.warn('[IngestionPipeline] Chunks insert batch warning:', chunkErr.message);
        }
      }
    } catch (e) {
      console.warn('[IngestionPipeline] Supabase storage exception:', e.message);
    }
  }

  return {
    success: true,
    documentId,
    title: docTitle,
    fileName,
    chunkCount: chunks.length,
    characterCount: text.length,
    chunks: chunkDataList
  };
}

/**
 * Predefined Josan Logistics Knowledge Base Sample Documents
 */
export const SAMPLE_KNOWLEDGE_DOCUMENTS = [
  {
    fileName: 'Air_Freight_Documentation_Guide.pdf',
    title: 'Air Freight Cargo & Documentation Standard Operating Procedure',
    category: 'Air Freight',
    description: 'Complete guide for required air freight documentation, Air Waybill (AWB) issuance, and Changi Air Cargo Hub procedures.',
    content: `JOSAN LOGISTICS PTE. LTD. - AIR FREIGHT STANDARD OPERATING PROCEDURE

1. AIR FREIGHT DOCUMENTATION REQUIREMENTS:
For all international and regional air cargo handled by Josan Logistics via Changi Air Cargo Hub (SIN), the following mandatory documents must be provided prior to origin departure:
- Master Air Waybill (MAWB) & House Air Waybill (HAWB)
- Commercial Invoice (in USD or SGD) detailing item description, HS Codes, unit values, and country of origin.
- Detailed Packing List (net weight, gross weight, dimension per crate/pallet).
- Shipper's Declaration for Dangerous Goods (DG Declaration) if cargo contains lithium batteries, chemicals, or hazardous materials under IATA DG Regulations.
- Certificate of Origin (Form D / Form E / Form AK where preferential tariff applies).

2. AIR WAYBILL (AWB) DEFINITION & RESPONSIBILITY:
An Air Waybill is a non-negotiable transport document issued by Josan Logistics as the freight forwarder or air carrier. It serves as proof of receipt of goods, evidence of the contract of carriage between shipper and carrier, and freight charge invoice.

3. CUSTOMS & INSPECTIONS AT CHANGI CARGO COMPLEX:
- All inbound air freight must be cleared through Singapore Customs (TradeNet System) prior to physical delivery.
- Perishable cargo receives express green-lane clearance within 2 hours of flight arrival.`
  },
  {
    fileName: 'Singapore_Customs_and_GST_Clearance.pdf',
    title: 'Singapore Customs Clearance & GST Regulations',
    category: 'Customs',
    description: 'Detailed explanation of Singapore TradeNet permits, Goods and Services Tax (GST) rate, and bonded warehousing.',
    content: `SINGAPORE CUSTOMS & GST CLEARANCE GUIDE - JOSAN LOGISTICS

1. TRADE PERMIT DECLARATION:
All commercial shipments entering or exiting Singapore require an approved TradeNet Permit issued by Singapore Customs.
- In-Payment (GST) Permit: Required for non-dutiable commercial imports. Singapore GST (9%) is payable on the CIF value (Cost, Insurance, and Freight).
- In-Non-Payment Permit: Used when goods enter a Licensed Warehouse or Zero-GST Warehouse.
- Out Permit: Required for all exports out of Singapore port/airport.

2. DUTIABLE & CONTROLLED GOODS:
- Dutiable items: Intoxicating liquors, tobacco products, motor vehicles, and petroleum products.
- Controlled goods (e.g. strategic goods, pharmaceuticals, food items) require clearance permits from Strategic Goods Control Branch, HSA, or SFA before customs release.

3. JOSAN LOGISTICS CUSTOMS BROKERAGE SERVICES:
Josan Logistics provides 24/7 TradeNet permit submission with average permit turnaround time under 15 minutes.`
  },
  {
    fileName: 'Incoterms_2020_Quick_Reference.pdf',
    title: 'Incoterms 2020 Logistics Reference',
    category: 'International Trade',
    description: 'Reference guide for Incoterms 2020 rules (EXW, FOB, CIF, DDP, DAP) used by Josan Logistics.',
    content: `INCOTERMS 2020 LOGISTICS GUIDE - JOSAN LOGISTICS

1. EXW (Ex Works):
Seller makes goods available at their warehouse premises. Buyer assumes all costs, freight insurance, customs clearance, and risk from seller's door to destination.

2. FOB (Free On Board):
Seller clears goods for export and loads them onto the designated vessel or aircraft. Buyer assumes cost and risk once loaded.

3. CIF (Cost, Insurance, and Freight):
Seller pays freight charges and marine/air insurance to destination port. Risk transfers to buyer once goods are loaded on ship/aircraft.

4. DDP (Delivered Duty Paid):
Josan Logistics assumes full responsibility for door-to-door delivery, including export clearance, international freight, Singapore import customs clearance, and payment of import GST & duties.

5. DAP (Delivered at Place):
Josan Logistics delivers goods to specified destination address. Import duties and GST remain buyer's responsibility upon arrival.`
  },
  {
    fileName: 'Josan_Logistics_Services_and_Pricing.pdf',
    title: 'Josan Logistics Corporate Services & Rate Card',
    category: 'Services & Rates',
    description: 'Overview of Josan Logistics transport services, fleet capabilities, warehousing, and pricing model.',
    content: `JOSAN LOGISTICS CORPORATE SERVICES & FLEET CAPABILITIES

1. ROAD FREIGHT & LOCAL DISTRIBUTION IN SINGAPORE:
- Fleet Options: 14ft Box Trucks (tailgate equipped), 24ft Heavy Lorries, and 40ft Prime Movers.
- Islandwide coverage across Woodlands, Jurong Industrial Estate, Tuas Port, Changi Airport, and CBD.
- Real-time GPS tracking and instant Proof of Delivery (e-POD) with signature capture.

2. INTERNATIONAL FREIGHT FORWARDING:
- Air Freight Express & Standard Consolidation.
- Cross-Border Trucking between Singapore, Malaysia (Johor Bahru, KL, Penang), and Thailand.
- Ocean Freight FCL (Full Container Load) & LCL (Less than Container Load).

3. VALUE-ADDED SERVICES:
- Bonded Warehousing & Temperature-Controlled Storage.
- Pick and Pack, Crating, and Hazardous Material handling.
- Instant Online Booking & Shipment Tracking via Josan Customer Portal.`
  }
];
