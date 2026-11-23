import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Singapore Tax Codes Configuration
 * - SR: Standard-Rated Supplies (9% GST)
 * - ZR: Zero-Rated Supplies (0% GST, e.g. international air freight services)
 * - ES: Exempt Supplies (0% GST, e.g. certain financial services)
 * - OS: Out-of-Scope Supplies (0% GST, outside scope of Singapore GST Act)
 */
export const TAX_CODES = Object.freeze({
  SR: { code: 'SR', label: 'Standard-Rated (9%)', rate: 0.09, description: 'Standard Singapore GST 9%' },
  ZR: { code: 'ZR', label: 'Zero-Rated (0%)', rate: 0.00, description: 'International air freight services' },
  ES: { code: 'ES', label: 'Exempt (0%)', rate: 0.00, description: 'Exempt supplies under GST Act' },
  OS: { code: 'OS', label: 'Out of Scope (0%)', rate: 0.00, description: 'Out-of-scope commercial transactions' }
});

export const INVOICE_STATUSES = [
  'Draft',
  'Sent',
  'Partially Paid',
  'Paid',
  'Overdue',
  'Void'
];

export const PAYMENT_METHODS = [
  'PayNow',
  'Bank Transfer',
  'Cheque',
  'Card',
  'Cash'
];

/**
 * Calculates itemized line totals and Singapore GST from line items
 */
export const calculateLineItemsTotals = (items = []) => {
  let subtotal = 0;
  let gst = 0;

  const processedItems = items.map(item => {
    const qty = Math.max(0, Number(item.qty || 1));
    const unitPrice = Math.max(0, Number(item.unitPrice ?? item.unit_price ?? 0));
    const taxCodeKey = (item.taxCode || item.tax_code || 'SR').toUpperCase();
    const taxDef = TAX_CODES[taxCodeKey] || TAX_CODES.SR;
    const baseLine = Number((qty * unitPrice).toFixed(2));
    const lineGst = Number((baseLine * taxDef.rate).toFixed(2));
    const lineTotal = Number((baseLine + lineGst).toFixed(2));

    subtotal += baseLine;
    gst += lineGst;

    return {
      description: item.description || 'Freight / Logistics Services',
      qty,
      unitPrice,
      unit_price: unitPrice,
      taxCode: taxDef.code,
      tax_code: taxDef.code,
      taxAmount: lineGst,
      tax_amount: lineGst,
      lineTotal,
      line_total: lineTotal
    };
  });

  subtotal = Number(subtotal.toFixed(2));
  gst = Number(gst.toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));

  return { subtotal, gst, total, items: processedItems };
};

export const accountingService = {
  /**
   * Fetch all invoices from Supabase with related line items, payments, and profile details
   */
  getInvoices: async ({ status, customerId } = {}) => {
    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem('josan_invoices');
        return { data: saved ? JSON.parse(saved) : [], error: null };
      } catch (e) {
        return { data: [], error: null };
      }
    }

    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*),
          payments (*),
          customer:customer_id (id, full_name, email, phone, company)
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[AccountingService] Supabase getInvoices error:', error);
        // Fallback to localStorage in dev/offline mode
        try {
          const saved = localStorage.getItem('josan_invoices');
          return { data: saved ? JSON.parse(saved) : [], error: null };
        } catch (_) {
          return { data: [], error: error.message };
        }
      }

      // Map DB structure to unified frontend invoice structure
      const formatted = (data || []).map(inv => {
        const total = Number(inv.total || 0);
        const amountPaid = Number(inv.amount_paid || 0);
        const balanceDue = Number(inv.balance_due ?? Math.max(0, total - amountPaid));
        const customerName = inv.customer?.company || inv.customer?.full_name || 'Commercial Client';

        return {
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          invoice_number: inv.invoice_number,
          status: inv.status,
          paymentStatus: inv.status,
          customerId: inv.customer_id,
          shipmentId: inv.shipment_id || '',
          quoteId: inv.quote_id || '',
          subtotal: Number(inv.amount_excl_gst || 0),
          amount_excl_gst: Number(inv.amount_excl_gst || 0),
          gst: Number(inv.gst || 0),
          taxAmount: Number(inv.gst || 0),
          total,
          amount_paid: amountPaid,
          amountPaid,
          balance_due: balanceDue,
          balanceDue,
          currency: inv.currency || 'SGD',
          exchangeRate: Number(inv.exchange_rate || 1.0),
          paymentTermsDays: Number(inv.payment_terms_days || 30),
          locked: Boolean(inv.locked),
          issued_at: inv.issued_at || inv.created_at,
          due_at: inv.due_at,
          paid_at: inv.paid_at,
          issueDate: inv.issued_at ? new Date(inv.issued_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          dueDate: inv.due_at ? new Date(inv.due_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          customerName,
          customerEmail: inv.customer?.email || '',
          customerPhone: inv.customer?.phone || '',
          service: inv.service_type || 'Commercial Logistics & Freight Coordination',
          items: (inv.invoice_items || []).map(it => ({
            id: it.id,
            description: it.description,
            qty: Number(it.qty || 1),
            unitPrice: Number(it.unit_price || 0),
            unit_price: Number(it.unit_price || 0),
            taxCode: it.tax_code || 'SR',
            tax_code: it.tax_code || 'SR',
            taxAmount: Number(it.tax_amount || 0),
            tax_amount: Number(it.tax_amount || 0),
            lineTotal: Number(it.line_total || 0),
            line_total: Number(it.line_total || 0)
          })),
          payments: inv.payments || []
        };
      });

      return { data: formatted, error: null };
    } catch (err) {
      console.warn('[AccountingService] Exception in getInvoices:', err);
      try {
        const saved = localStorage.getItem('josan_invoices');
        return { data: saved ? JSON.parse(saved) : [], error: null };
      } catch (_) {
        return { data: [], error: err.message };
      }
    }
  },

  /**
   * Create an invoice with sequential database numbering and itemized tax codes
   */
  createInvoice: async ({
    customerId = null,
    customerName = '',
    customerEmail = '',
    customerPhone = '',
    shipmentId = null,
    quoteId = null,
    items = [],
    status = 'Sent',
    paymentTermsDays = 30,
    currency = 'SGD'
  }) => {
    const { subtotal, gst, total, items: processedItems } = calculateLineItemsTotals(
      items.length > 0
        ? items
        : [{ description: 'Commercial Freight Logistics', qty: 1, unitPrice: 0, taxCode: 'SR' }]
    );

    const now = new Date();
    const dueAt = new Date(now.getTime() + paymentTermsDays * 24 * 60 * 60 * 1000);

    if (!isSupabaseConfigured) {
      const year = now.getFullYear();
      const mockInvId = `INV-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newInvoice = {
        id: mockInvId,
        invoiceNumber: mockInvId,
        invoice_number: mockInvId,
        customerId,
        customerName: customerName || 'Commercial Client',
        customerEmail,
        customerPhone,
        shipmentId: shipmentId || '',
        quoteId: quoteId || '',
        subtotal,
        amount_excl_gst: subtotal,
        gst,
        taxAmount: gst,
        total,
        amount_paid: 0.00,
        amountPaid: 0.00,
        balance_due: total,
        balanceDue: total,
        status,
        paymentStatus: status,
        currency,
        paymentTermsDays,
        issued_at: now.toISOString(),
        due_at: dueAt.toISOString(),
        issueDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        dueDate: dueAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: processedItems,
        payments: []
      };

      try {
        const saved = localStorage.getItem('josan_invoices');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift(newInvoice);
        localStorage.setItem('josan_invoices', JSON.stringify(list));
      } catch (_) {}

      return { data: newInvoice, error: null };
    }

    try {
      // 1. Insert invoice into public.invoices (DB sets sequential invoice_number via default)
      const invoicePayload = {
        customer_id: customerId || null,
        shipment_id: shipmentId || null,
        quote_id: quoteId || null,
        amount_excl_gst: subtotal,
        gst,
        total,
        amount_paid: 0.00,
        balance_due: total,
        status: status || 'Sent',
        currency,
        exchange_rate: 1.0000,
        payment_terms_days: paymentTermsDays,
        issued_at: now.toISOString(),
        due_at: dueAt.toISOString()
      };

      const { data: invRow, error: invError } = await supabase
        .from('invoices')
        .insert(invoicePayload)
        .select()
        .single();

      if (invError) throw invError;

      // 2. Insert itemized line items into public.invoice_items
      if (processedItems.length > 0 && invRow?.id) {
        const itemRows = processedItems.map(it => ({
          invoice_id: invRow.id,
          description: it.description,
          qty: it.qty,
          unit_price: it.unitPrice,
          tax_code: it.taxCode,
          tax_amount: it.taxAmount,
          line_total: it.lineTotal
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemRows);

        if (itemsError) {
          console.warn('[AccountingService] Warning inserting invoice items:', itemsError);
        }
      }

      return {
        data: {
          ...invRow,
          invoiceNumber: invRow.invoice_number,
          subtotal: Number(invRow.amount_excl_gst),
          gst: Number(invRow.gst),
          total: Number(invRow.total),
          amount_paid: Number(invRow.amount_paid || 0),
          balance_due: Number(invRow.balance_due ?? invRow.total),
          customerName: customerName || 'Commercial Client',
          customerEmail,
          customerPhone,
          items: processedItems,
          payments: []
        },
        error: null
      };
    } catch (err) {
      console.error('[AccountingService] createInvoice error:', err);
      return { data: null, error: err.message };
    }
  },

  /**
   * Update invoice payment or workflow status
   */
  updateInvoiceStatus: async (id, status) => {
    if (!id) return { error: 'Invoice ID is required' };

    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem('josan_invoices');
        if (saved) {
          const list = JSON.parse(saved).map(i => (i.id === id || i.invoiceNumber === id) ? { ...i, status, paymentStatus: status } : i);
          localStorage.setItem('josan_invoices', JSON.stringify(list));
        }
      } catch (_) {}
      return { error: null };
    }

    try {
      const updates = {
        status,
        updated_at: new Date().toISOString()
      };
      if (status === 'Paid') {
        updates.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { error: err.message };
    }
  },

  /**
   * Record a payment against an invoice (supports partial or full settlement)
   */
  recordPayment: async ({
    invoiceId,
    amount,
    method = 'PayNow',
    reference = '',
    notes = '',
    recordedBy = null
  }) => {
    const numericAmount = Math.max(0, Number(amount));
    if (!invoiceId || numericAmount <= 0) {
      return { error: 'Valid invoice ID and positive payment amount are required' };
    }

    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem('josan_invoices');
        if (saved) {
          const list = JSON.parse(saved).map(inv => {
            if (inv.id === invoiceId || inv.invoiceNumber === invoiceId) {
              const currentPaid = Number(inv.amount_paid || inv.amountPaid || 0);
              const newPaid = Number((currentPaid + numericAmount).toFixed(2));
              const total = Number(inv.total || 0);
              const newBalance = Math.max(0, Number((total - newPaid).toFixed(2)));
              const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
              return {
                ...inv,
                amount_paid: newPaid,
                amountPaid: newPaid,
                balance_due: newBalance,
                balanceDue: newBalance,
                status: newStatus,
                paymentStatus: newStatus,
                payments: [
                  ...(inv.payments || []),
                  {
                    id: `pay-${Date.now()}`,
                    amount: numericAmount,
                    method,
                    reference,
                    notes,
                    received_at: new Date().toISOString()
                  }
                ]
              };
            }
            return inv;
          });
          localStorage.setItem('josan_invoices', JSON.stringify(list));
        }
      } catch (_) {}
      return { data: { success: true }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          invoice_id: invoiceId,
          amount: numericAmount,
          method,
          reference: reference || null,
          notes: notes || null,
          recorded_by: recordedBy || null,
          received_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[AccountingService] recordPayment error:', err);
      return { data: null, error: err.message };
    }
  },

  /**
   * Fetch credit notes
   */
  getCreditNotes: async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from('credit_notes')
        .select(`
          *,
          invoice:invoice_id (id, invoice_number, total, customer_id)
        `)
        .order('issued_at', { ascending: false });

      return { data: data || [], error: error?.message || null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  /**
   * Create a Credit Note against an invoice
   */
  createCreditNote: async ({
    invoiceId,
    amount,
    gst = 0,
    reason,
    issuedBy = null
  }) => {
    if (!invoiceId || !amount || !reason) {
      return { error: 'Invoice, amount, and reason are required for credit note' };
    }

    if (!isSupabaseConfigured) {
      return { data: { id: `CN-${Date.now()}`, invoice_id: invoiceId, amount, gst, reason }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('credit_notes')
        .insert({
          invoice_id: invoiceId,
          amount: Number(amount),
          gst: Number(gst || 0),
          reason,
          issued_by: issuedBy || null,
          issued_at: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  /**
   * Fetch partner transportation carrier vendor bills (payables)
   */
  getVendorBills: async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from('vendor_bills')
        .select(`
          *,
          partner:partner_id (id, name, company, email),
          shipment:shipment_id (id, tracking_number, origin_city, destination_city)
        `)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  /**
   * Create a vendor bill
   */
  createVendorBill: async ({
    partnerId,
    shipmentId = null,
    billNumber,
    amount,
    gst = 0,
    dueAt = null,
    status = 'Pending'
  }) => {
    if (!partnerId || !billNumber || amount === undefined) {
      return { error: 'Partner, bill number, and amount are required' };
    }

    if (!isSupabaseConfigured) {
      return { data: { id: `VB-${Date.now()}`, bill_number: billNumber, amount }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('vendor_bills')
        .insert({
          partner_id: partnerId,
          shipment_id: shipmentId || null,
          bill_number: billNumber,
          amount: Number(amount),
          gst: Number(gst || 0),
          due_at: dueAt || null,
          status
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }
};

