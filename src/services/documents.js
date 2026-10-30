import { supabase, isSupabaseConfigured } from './supabase';

export const documentsService = {
  /**
   * Upload and record Digital Proof of Delivery (POD) into public.shipment_documents.
   */
  submitProofOfDelivery: async ({ shipmentId, driverId, receiverName, signatureUrl, photoUrl, notes }) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    try {
      const docRecord = {
        shipment_id: shipmentId,
        doc_type: 'Proof of Delivery (POD)',
        file_path: signatureUrl || photoUrl || `pod/${shipmentId}_completed.pdf`,
        visible_to_customer: true,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('shipment_documents')
        .insert([docRecord])
        .select();

      if (error) {
        console.warn('[DocumentsService] Submit POD document error:', error.message);
      }

      // Update shipment status to Delivered (conforms to schema check constraint)
      await supabase.from('shipments').update({
        status: 'Delivered',
        updated_at: new Date().toISOString()
      }).eq('id', shipmentId);

      // Log delivery event to tracking_events
      await supabase.from('tracking_events').insert([{
        shipment_id: shipmentId,
        stage: 'Delivered',
        note: notes || `Consignment delivered to ${receiverName || 'Authorized Receiving Officer'}. POD recorded.`,
        source: 'manual',
        is_public: true
      }]);

      const insertedDoc = data?.[0];
      return {
        id: insertedDoc?.id || `POD-${Date.now()}`,
        shipment_id: shipmentId,
        receiver_name: receiverName || 'Authorized Officer',
        signature_url: signatureUrl || '',
        photo_url: photoUrl || '',
        notes: notes || 'Delivered',
        delivered_at: new Date().toISOString()
      };
    } catch (err) {
      console.error('[DocumentsService] Error submitting POD:', err);
      return null;
    }
  },

  /**
   * Fetch Proof of Delivery record for a shipment from public.shipment_documents.
   */
  getProofOfDelivery: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId)
        .ilike('doc_type', '%Proof of Delivery%')
        .maybeSingle();

      if (error) {
        console.warn('[DocumentsService] Fetch POD error:', error.message);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        shipment_id: data.shipment_id,
        receiver_name: 'Authorized Receiving Officer',
        signature_url: data.file_path,
        photo_url: data.file_path,
        notes: 'Proof of Delivery verified on record',
        delivered_at: data.created_at
      };
    } catch (err) {
      console.error('[DocumentsService] Error fetching POD:', err);
      return null;
    }
  },

  /**
   * Fetch all documents for a shipment from shipment_documents.
   */
  getShipmentDocuments: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return [];

    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[DocumentsService] Fetch shipment_documents error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[DocumentsService] Error fetching shipment documents:', err);
      return [];
    }
  },

  /**
   * Upload file asset to Supabase Storage bucket.
   */
  uploadFile: async (bucket, path, file) => {
    if (!isSupabaseConfigured || !file) return null;

    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true
      });

      if (error) {
        console.warn('[DocumentsService] File upload error:', error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      return publicUrlData?.publicUrl || null;
    } catch (err) {
      console.error('[DocumentsService] Error in uploadFile:', err);
      return null;
    }
  }
};
