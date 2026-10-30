/**
 * Document Ingestion Pipeline for RAG
 * Pipeline: File Upload -> Text Extraction -> Chunking -> Embedding -> Database Indexing
 */

import { supabase, isSupabaseConfigured } from '../../services/supabase.js';
import { extractTextFromFile } from './textExtractor.js';
import { chunkDocument } from './chunker.js';
import { generateEmbedding } from './embeddings.js';

export async function ingestDocument({ fileBuffer, fileName, fileType, title, category = 'General', description = '', source = '', date = '', isOfficialJosan = false }) {
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
      metadata: {
        ...chunk.metadata,
        documentTitle: docTitle,
        category,
        source,
        date,
        isOfficialJosan
      }
    });
  }

  // 4. Save Master Document Record & Chunks in Supabase if available
  if (isSupabaseConfigured) {
    try {
      // Insert Master Document into knowledge_base_documents
      const { error: docErr } = await supabase
        .from('knowledge_base_documents')
        .insert([{
          title: docTitle,
          content: text,
          source: source || fileName,
          owner_name: 'Josan Logistics Team',
          status: 'Approved',
          created_at: new Date().toISOString()
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
    category,
    source,
    date,
    isOfficialJosan,
    chunkCount: chunks.length,
    characterCount: text.length,
    chunks: chunkDataList
  };
}

/**
 * Predefined Josan Logistics Knowledge Base Documents
 * Contains Josan approved operational documents and explicit General Reference documents.
 */
export const SAMPLE_KNOWLEDGE_DOCUMENTS = [
  {
    fileName: 'Josan_Services.txt',
    title: 'Josan Logistics Services Overview',
    category: 'Company Services',
    description: 'Scope of Josan Logistics freight coordination, air freight documentation support, and road transportation coordination in Singapore.',
    source: 'Josan Logistics Internal Operations',
    date: '2026-10-26',
    isOfficialJosan: true,
    content: `JOSAN LOGISTICS PTE. LTD. - COMPANY SERVICES OVERVIEW
Source: Josan Logistics Approved Text
Date: 26 October 2026

1. COMPANY SCOPE:
Josan Logistics is a freight coordinator based in Singapore. We provide documentation support and coordinate commercial road transportation through established third-party partners. We do not own trucks and do not operate cargo aircraft. All freight carriage is performed by independent transport partners and airline carriers.

2. AIR FREIGHT DOCUMENTATION SUPPORT:
We assist shippers with Air Waybill (AWB) preparation, consignment details, documentation checks, and cargo handover coordination for partner airlines operating via Changi Air Cargo Hub.

3. ROAD TRANSPORTATION COORDINATION:
We coordinate commercial road freight transport across Singapore through independent transport partners. Vehicle types coordinated through partners include box trucks (with tailgate), heavy lorries, and prime movers for commercial deliveries.

4. SHIPMENT DOCUMENTATION SUPPORT:
We assist businesses with organizing standard trade paperwork, consignment notes, delivery orders, and transport documentation.

5. EXCLUSIONS & LIMITATIONS:
Josan Logistics does not provide customs clearance, customs broking, tariff classification, or GST advice. We do not provide legal advice or cargo insurance. We do not accept or handle tobacco, spirits and liquors, wines, fresh and frozen food products, chemicals, or healthcare/pharmaceutical supplies.`
  },
  {
    fileName: 'Josan_Quote_Process.txt',
    title: 'Josan Logistics Quote Process',
    category: 'Quotes & Billing',
    description: 'How to request a quote, required details, no fixed rates or guarantees, and payment terms.',
    source: 'Josan Logistics Internal Operations',
    date: '2026-10-26',
    isOfficialJosan: true,
    content: `JOSAN LOGISTICS PTE. LTD. - QUOTE PROCESS
Source: Josan Logistics Approved Text
Date: 26 October 2026

1. REQUESTING A QUOTE:
Customers can request a quotation through our website at the Request a Quote page (/quote) or by emailing contact@josanlogistics.com.sg. Required details include origin, destination, cargo nature, dimensions, estimated weight, and service requirements.

2. PRICING & GUARANTEE POLICY:
We do not publish fixed price lists, per-kilogram rates, transit time guarantees, or promotional discounts. Rates depend on partner availability, fuel surcharges, cargo specifications, route, and schedule.

3. NO UPFRONT PAYMENT:
Submitting a quote inquiry is free of charge and carries no payment obligation.

4. INVOICES & PAYMENT TERMS:
Formal quotations are issued directly by our team. Payment terms and quote validity periods are stated in the specific quotation or commercial invoice.`
  },
  {
    fileName: 'Josan_Tracking_Page.txt',
    title: 'Josan Logistics Tracking Portal Guide',
    category: 'Shipment Tracking',
    description: 'How tracking works on the Track Shipment page, reference numbers, and dispatch milestone updates.',
    source: 'Josan Logistics Operations Team',
    date: '2026-10-26',
    isOfficialJosan: true,
    content: `JOSAN LOGISTICS PTE. LTD. - TRACKING PORTAL GUIDE
Source: Josan Logistics Approved Text
Date: 26 October 2026

1. TRACKING ACCESS:
Customers can check shipment progress on our website Track Shipment page (/track) using their Josan tracking reference (e.g., JL-XXXX-XXXX) or Air Waybill number.

2. STATUS UPDATES:
Tracking milestone statuses (Booked, Received at Hub, In Transit, Customs Handover, Out for Delivery, Delivered) are entered by the operations dispatch team upon confirmation from partner carriers.

3. INDICATIVE TIMESTAMPS:
Milestones are indicative and reflect the time entered by operations dispatch. Always refer to the 'Last updated' timestamp on the tracking screen. Automated real-time telematics are not claimed.`
  },
  {
    fileName: 'Josan_Contact_Details.txt',
    title: 'Josan Logistics Contact Details & Support',
    category: 'Contact & Support',
    description: 'Contact channels, Singapore operational scope, email address, and Data Protection Officer contact.',
    source: 'Josan Logistics Corporate Information',
    date: '2026-10-26',
    isOfficialJosan: true,
    content: `JOSAN LOGISTICS PTE. LTD. - CONTACT DETAILS
Source: Josan Logistics Approved Text
Date: 26 October 2026

1. GENERAL CONTACT:
- Operations & Customer Inquiries: contact@josanlogistics.com.sg
- Website Contact Form: Available on the Contact page (/contact)
- Operating Jurisdiction: Singapore

2. SUPPORT SCOPE & CONTACT HOURS:
- Contact Hours: Shown on the Contact page ([ENTER HOURS]).
- General inquiries, quote requests, and documentation support coordination.

3. DATA PROTECTION OFFICER (DPO):
For data access requests, corrections, or privacy questions under the Singapore PDPA, email contact@josanlogistics.com.sg with 'Attn: Data Protection Officer'. We aim to respond within 30 days.`
  },
  {
    fileName: 'Josan_Document_Checklist.txt',
    title: 'Josan Logistics Document Checklist',
    category: 'Documentation',
    description: 'Checklist of standard commercial freight documents with mandatory note that requirements vary.',
    source: 'Josan Logistics Documentation Team',
    date: '2026-10-26',
    isOfficialJosan: true,
    content: `JOSAN LOGISTICS PTE. LTD. - FREIGHT DOCUMENT CHECKLIST
Source: Josan Logistics Approved Text
Date: 26 October 2026

1. IMPORTANT NOTICE: REQUIREMENTS VARY:
Requirements vary depending on the shipment, cargo nature, mode of transport, and the authorities involved. Shippers must confirm specific regulatory requirements with the relevant government authorities or their appointed customs broker. Josan Logistics provides documentation support only and does not act as a customs broker or clearance agent.

2. COMMON COMMERCIAL AIR FREIGHT DOCUMENTS COORDINATED:
- Air Waybill (AWB): Contract of carriage and cargo transport document for air freight.
- Commercial Invoice: Shipper's invoice specifying item descriptions, values, and currencies.
- Packing List: Breakdown of package count, net and gross weight, and dimensions.

3. LOCAL ROAD TRANSPORT DOCUMENTS:
- Lorry Receipt (LR) / Consignment Note: Paperwork accompanying local transport.`
  },
  {
    fileName: 'General_Reference_Singapore_Customs.txt',
    title: 'Singapore Customs Permit Overview (General Reference)',
    category: 'General Reference',
    description: 'General industry reference on Singapore Customs permit types and authority requirements. Not Josan Logistics policy.',
    source: 'Singapore Customs Public Guidance (General Reference)',
    date: '2026-01-01',
    isOfficialJosan: false,
    content: `GENERAL INDUSTRY REFERENCE ONLY - NOT JOSAN LOGISTICS POLICY
Source: Singapore Customs Public Information (General Reference)
Date: 1 January 2026

Notice: This document is provided solely as general industry reference. Josan Logistics is a freight coordinator and does not provide customs clearance, customs broking, permit declarations, tariff advice, or GST guidance. Importers and exporters must consult Singapore Customs (www.customs.gov.sg) or their licensed customs agent directly.

1. OVERVIEW OF CUSTOMS PERMITS:
Commercial shipments moving through Singapore typically require permits declared via Singapore Customs:
- In-Payment (GST) Permit: For non-dutiable commercial imports subject to Singapore GST.
- In-Non-Payment Permit: For goods entering licensed warehouses or approved trade schemes.
- Out Permit: For commercial export shipments leaving Singapore.

2. CONTROLLED AND DUTIABLE GOODS:
Specific goods (such as strategic items, controlled commodities) require regulatory approval from relevant Controlling Authorities before clearance.`
  },
  {
    fileName: 'General_Reference_Incoterms_2020.txt',
    title: 'Incoterms 2020 Summary (General Reference)',
    category: 'General Reference',
    description: 'General trade reference on standard Incoterms 2020 definitions. Not Josan Logistics policy.',
    source: 'International Chamber of Commerce (ICC) Incoterms 2020 (General Reference)',
    date: '2020-01-01',
    isOfficialJosan: false,
    content: `GENERAL INDUSTRY REFERENCE ONLY - NOT JOSAN LOGISTICS POLICY
Source: International Chamber of Commerce (ICC) Incoterms 2020 (General Reference)
Date: 1 January 2020

Notice: This summary is provided solely for general trade reference. Incoterms define standard international commercial sale terms between buyers and sellers. Josan Logistics provides transport coordination and documentation support under agreed written instructions.

1. EXW (Ex Works): Seller places goods at buyer's disposal at seller's premises. Buyer bears all transport costs, clearance, and risk.
2. FOB (Free On Board): Seller delivers goods on board the vessel/aircraft nominated by buyer.
3. CIF (Cost, Insurance and Freight): Seller pays freight charges and minimum insurance to destination port.
4. DAP (Delivered at Place): Seller delivers goods to specified location ready for unloading; import clearance and taxes remain buyer's responsibility.
5. DDP (Delivered Duty Paid): Seller delivers goods cleared for import with duties and taxes borne by seller.`
  }
];
