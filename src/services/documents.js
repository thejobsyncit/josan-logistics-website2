import { supabase, isSupabaseConfigured } from './supabase';

export const documentsService = {
  /**
   * Upload and record Digital Proof of Delivery (POD).
   */
  submitProofOfDelivery: async ({ shipmentId, driverId, receiverName, signatureUrl, photoUrl, notes }) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    const podRecord = {
      shipment_id: shipmentId,
      driver_id: driverId || null,
      receiver_name: receiverName || 'Authorized Receiving Officer',
      signature_url: signatureUrl || '',
      photo_url: photoUrl || '',
      notes: notes || 'Delivery completed',
      delivered_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('proof_of_delivery')
      .insert([podRecord])
      .select();

    if (error) {
      console.warn('[DocumentsService] Submit POD error:', error.message);
      return null;
    }

    // Update shipment pod json field and set status to DELIVERY_COMPLETED
    await supabase.from('shipments').update({
      status: 'DELIVERY_COMPLETED',
      status_type: 'success',
      otp_verified: true,
      pod: {
        recipientName: receiverName,
        recipientSignature: signatureUrl,
        photo: photoUrl,
        remarks: notes,
        deliveredAt: new Date().toISOString(),
        driverId
      }
    }).eq('id', shipmentId);

    return data?.[0];
  },

  /**
   * Fetch Proof of Delivery record for a shipment.
   */
  getProofOfDelivery: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    const { data, error } = await supabase
      .from('proof_of_delivery')
      .select('*')
      .eq('shipment_id', shipmentId)
      .maybeSingle();

    if (error) {
      console.warn('[DocumentsService] Fetch POD error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Upload file asset to Supabase Storage bucket.
   */
  uploadFile: async (bucket, path, file) => {
    if (!isSupabaseConfigured || !file) return null;

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true
    });

    if (error) {
      console.warn('[DocumentsService] File upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrlData?.publicUrl || null;
  }
};
