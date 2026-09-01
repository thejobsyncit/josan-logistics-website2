import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { X, Printer, Download, Truck, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export const InvoiceModal = () => {
  const { selectedInvoiceShipment, setSelectedInvoiceShipment, showToast } = useLogistics();

  if (!selectedInvoiceShipment) return null;

  const shipment = selectedInvoiceShipment;
  const basePriceNum = parseFloat(shipment.price.replace('$', '').replace(',', '')) || 350;
  const fuelSurcharge = (basePriceNum * 0.08).toFixed(2);
  const insuranceFee = (basePriceNum * 0.05).toFixed(2);
  const tax = (basePriceNum * 0.07).toFixed(2);
  const totalPrice = (basePriceNum + parseFloat(fuelSurcharge) + parseFloat(insuranceFee) + parseFloat(tax)).toFixed(2);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    const logoUrl = `${window.location.origin}/assets/josan_logo.jpg`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice - ${shipment.id}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0F172A; background: #ffffff; margin: 0; padding: 0; line-height: 1.5; font-size: 13px; }
          .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #F26722; padding-bottom: 16px; margin-bottom: 20px; }
          .logo { height: 48px; width: auto; object-fit: contain; }
          .subtitle { font-size: 11px; color: #64748B; font-weight: 600; margin: 4px 0 2px 0; }
          .address { font-size: 11px; color: #64748B; margin: 0; }
          .badge { display: inline-block; background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
          .inv-title { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0; }
          .inv-meta { font-size: 11px; color: #64748B; margin: 2px 0; }
          
          .barcode-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .barcode-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; }
          .barcode-id { font-family: monospace; font-size: 18px; font-weight: 800; color: #F26722; margin-top: 2px; }
          .barcode-lines { display: flex; align-items: center; gap: 2px; height: 32px; }
          .line { background: #0F172A; height: 100%; }

          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; }
          .card-header { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px; }
          .card-name { font-size: 14px; font-weight: 800; color: #0F172A; }
          .card-desc { font-size: 12px; color: #475569; margin: 4px 0; }
          .card-hub { font-size: 11px; color: #64748B; font-weight: 600; }

          .section-title { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; }
          th { background: #F1F5F9; font-weight: 700; color: #334155; padding: 10px 14px; text-align: left; border-bottom: 1px solid #E2E8F0; }
          td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #F1F5F9; color: #334155; }
          tr:last-child td { border-bottom: none; }
          .total-row { background: #FFF4EE !important; font-weight: 800; }
          .total-row td { color: #0F172A; font-size: 14px; padding: 12px 14px; }
          .total-amount { color: #F26722; font-weight: 800; font-family: monospace; font-size: 16px; }
          
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748B; }
          .footer-guarantee { font-weight: 600; color: #475569; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <img src="${logoUrl}" class="logo" alt="Josan Logistics Logo" />
              <p class="subtitle">Regional & Global Supply Chain Management</p>
              <p class="address">450 Logistics Parkway, Chicago, IL 60607</p>
              <p class="address">Tax Registration ID: US-JOS-98210492</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">PAID & VERIFIED</span>
              <h1 class="inv-title">INVOICE #${shipment.id}</h1>
              <p class="inv-meta">Date Issued: ${shipment.createdDate || 'Aug 29, 2026'}</p>
              <p class="inv-meta">Payment Term: Net 30</p>
            </div>
          </div>

          <div class="barcode-box">
            <div>
              <div class="barcode-label">Tracking Bill of Lading</div>
              <div class="barcode-id">${shipment.id}</div>
            </div>
            <div class="barcode-lines">
              ${[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 4, 2, 1, 5, 3, 4, 2].map(w => `<div class="line" style="width: ${w}px;"></div>`).join('')}
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-header">SHIP FROM (ORIGIN)</div>
              <div class="card-name">${shipment.sender}</div>
              <div class="card-desc">${shipment.senderAddress || 'Origin Depot'}</div>
              <div class="card-hub">Hub: ${shipment.origin}</div>
            </div>
            <div class="card">
              <div class="card-header">SHIP TO (DESTINATION)</div>
              <div class="card-name">${shipment.receiver}</div>
              <div class="card-desc">${shipment.receiverAddress || 'Destination Depot'}</div>
              <div class="card-hub">Hub: ${shipment.destination}</div>
            </div>
          </div>

          <div class="section-title">Freight Specifications</div>
          <table>
            <thead>
              <tr>
                <th>Service Level</th>
                <th>Cargo Type</th>
                <th>Weight</th>
                <th>Declared Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700; color: #F26722;">${shipment.serviceLevel}</td>
                <td>${shipment.cargoType}</td>
                <td style="font-family: monospace;">${shipment.weight} (${shipment.pieces || 1} Pcs)</td>
                <td style="font-family: monospace;">${shipment.declaredValue || '$10,000'}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Itemized Charges</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Freight Transportation Fee</td>
                <td style="text-align: right; font-family: monospace; font-weight: 600;">$${basePriceNum.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Fuel Surcharge (8%)</td>
                <td style="text-align: right; font-family: monospace;">$${fuelSurcharge}</td>
              </tr>
              <tr>
                <td>Cargo Security & Insurance Policy (5%)</td>
                <td style="text-align: right; font-family: monospace;">$${insuranceFee}</td>
              </tr>
              <tr>
                <td>GST / Sales Tax (7%)</td>
                <td style="text-align: right; font-family: monospace;">$${tax}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL DUE / PAID</td>
                <td style="text-align: right;" class="total-amount">$${totalPrice} USD</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div class="footer-guarantee">🛡️ Full Cargo Loss Protection Guarantee by Josan Cover</div>
            <div style="font-weight: 700; color: #334155;">Thank you for choosing Josan Logistics!</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast(`Opened print preview for Invoice #${shipment.id}`);
  };

  const handleDownloadPDF = () => {
    const logoUrl = `${window.location.origin}/assets/josan_logo.jpg`;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice - ${shipment.id}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0F172A; background: #ffffff; margin: 0; padding: 30px; line-height: 1.5; font-size: 13px; }
          .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #F26722; padding-bottom: 16px; margin-bottom: 20px; }
          .logo { height: 48px; width: auto; object-fit: contain; }
          .subtitle { font-size: 11px; color: #64748B; font-weight: 600; margin: 4px 0 2px 0; }
          .address { font-size: 11px; color: #64748B; margin: 0; }
          .badge { display: inline-block; background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
          .inv-title { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0; }
          .inv-meta { font-size: 11px; color: #64748B; margin: 2px 0; }
          
          .barcode-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .barcode-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; }
          .barcode-id { font-family: monospace; font-size: 18px; font-weight: 800; color: #F26722; margin-top: 2px; }
          .barcode-lines { display: flex; align-items: center; gap: 2px; height: 32px; }
          .line { background: #0F172A; height: 100%; }

          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; }
          .card-header { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px; }
          .card-name { font-size: 14px; font-weight: 800; color: #0F172A; }
          .card-desc { font-size: 12px; color: #475569; margin: 4px 0; }
          .card-hub { font-size: 11px; color: #64748B; font-weight: 600; }

          .section-title { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; }
          th { background: #F1F5F9; font-weight: 700; color: #334155; padding: 10px 14px; text-align: left; border-bottom: 1px solid #E2E8F0; }
          td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #F1F5F9; color: #334155; }
          tr:last-child td { border-bottom: none; }
          .total-row { background: #FFF4EE !important; font-weight: 800; }
          .total-row td { color: #0F172A; font-size: 14px; padding: 12px 14px; }
          .total-amount { color: #F26722; font-weight: 800; font-family: monospace; font-size: 16px; }
          
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748B; }
          .footer-guarantee { font-weight: 600; color: #475569; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <img src="${logoUrl}" class="logo" alt="Josan Logistics Logo" />
              <p class="subtitle">Regional & Global Supply Chain Management</p>
              <p class="address">450 Logistics Parkway, Chicago, IL 60607</p>
              <p class="address">Tax Registration ID: US-JOS-98210492</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">PAID & VERIFIED</span>
              <h1 class="inv-title">INVOICE #${shipment.id}</h1>
              <p class="inv-meta">Date Issued: ${shipment.createdDate || 'Aug 29, 2026'}</p>
              <p class="inv-meta">Payment Term: Net 30</p>
            </div>
          </div>

          <div class="barcode-box">
            <div>
              <div class="barcode-label">Tracking Bill of Lading</div>
              <div class="barcode-id">${shipment.id}</div>
            </div>
            <div class="barcode-lines">
              ${[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 4, 2, 1, 5, 3, 4, 2].map(w => `<div class="line" style="width: ${w}px;"></div>`).join('')}
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-header">SHIP FROM (ORIGIN)</div>
              <div class="card-name">${shipment.sender}</div>
              <div class="card-desc">${shipment.senderAddress || 'Origin Depot'}</div>
              <div class="card-hub">Hub: ${shipment.origin}</div>
            </div>
            <div class="card">
              <div class="card-header">SHIP TO (DESTINATION)</div>
              <div class="card-name">${shipment.receiver}</div>
              <div class="card-desc">${shipment.receiverAddress || 'Destination Depot'}</div>
              <div class="card-hub">Hub: ${shipment.destination}</div>
            </div>
          </div>

          <div class="section-title">Freight Specifications</div>
          <table>
            <thead>
              <tr>
                <th>Service Level</th>
                <th>Cargo Type</th>
                <th>Weight</th>
                <th>Declared Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700; color: #F26722;">${shipment.serviceLevel}</td>
                <td>${shipment.cargoType}</td>
                <td style="font-family: monospace;">${shipment.weight} (${shipment.pieces || 1} Pcs)</td>
                <td style="font-family: monospace;">${shipment.declaredValue || '$10,000'}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Itemized Charges</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Freight Transportation Fee</td>
                <td style="text-align: right; font-family: monospace; font-weight: 600;">$${basePriceNum.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Fuel Surcharge (8%)</td>
                <td style="text-align: right; font-family: monospace;">$${fuelSurcharge}</td>
              </tr>
              <tr>
                <td>Cargo Security & Insurance Policy (5%)</td>
                <td style="text-align: right; font-family: monospace;">$${insuranceFee}</td>
              </tr>
              <tr>
                <td>GST / Sales Tax (7%)</td>
                <td style="text-align: right; font-family: monospace;">$${tax}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL DUE / PAID</td>
                <td style="text-align: right;" class="total-amount">$${totalPrice} USD</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div class="footer-guarantee">🛡️ Full Cargo Loss Protection Guarantee by Josan Cover</div>
            <div style="font-weight: 700; color: #334155;">Thank you for choosing Josan Logistics!</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${shipment.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Invoice File: Invoice-${shipment.id}.html`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Action Controls Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-sm">Official Freight Bill & Invoice</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Download Invoice File</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setSelectedInvoiceShipment(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 space-y-6 bg-white text-slate-900">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-orange-500 pb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <img src="/assets/josan_logo.jpg" alt="Josan Logistics Logo" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-xs text-slate-500 font-semibold">Regional & Global Supply Chain Management</p>
              <p className="text-xs text-slate-500">450 Logistics Parkway, Chicago, IL 60607</p>
              <p className="text-xs text-slate-500">Tax Registration ID: US-JOS-98210492</p>
            </div>

            <div className="mt-4 sm:mt-0 sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase mb-2">
                PAID & VERIFIED
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">INVOICE #{shipment.id}</h2>
              <p className="text-xs text-slate-500">Date Issued: {shipment.createdDate || 'Aug 29, 2026'}</p>
              <p className="text-xs text-slate-500">Payment Term: Net 30</p>
            </div>
          </div>

          {/* Barcode Graphic */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Tracking Bill of Lading</p>
              <p className="text-lg font-mono font-bold text-orange-600">{shipment.id}</p>
            </div>
            {/* Simulated Barcode */}
            <div className="flex items-center space-x-1 h-8 opacity-80">
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 4, 2, 1, 5, 3, 4, 2].map((w, i) => (
                <div key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }}></div>
              ))}
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">SHIP FROM (ORIGIN):</p>
              <p className="font-bold text-slate-900 text-sm">{shipment.sender}</p>
              <p className="text-slate-600 mt-1">{shipment.senderAddress}</p>
              <p className="text-slate-500 mt-1">Hub: {shipment.origin}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">SHIP TO (DESTINATION):</p>
              <p className="font-bold text-slate-900 text-sm">{shipment.receiver}</p>
              <p className="text-slate-600 mt-1">{shipment.receiverAddress}</p>
              <p className="text-slate-500 mt-1">Hub: {shipment.destination}</p>
            </div>
          </div>

          {/* Cargo Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Freight Specifications</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Service Level</th>
                    <th className="p-3">Cargo Type</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Declared Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-orange-600">{shipment.serviceLevel}</td>
                    <td className="p-3">{shipment.cargoType}</td>
                    <td className="p-3 font-mono">{shipment.weight} ({shipment.pieces || 1} Pcs)</td>
                    <td className="p-3 font-mono">{shipment.declaredValue || '$10,000'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Itemized Charges</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 text-slate-700">Base Freight Transportation Fee</td>
                    <td className="p-3 text-right font-mono font-semibold">${basePriceNum.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-700">Fuel Surcharge (8%)</td>
                    <td className="p-3 text-right font-mono">${fuelSurcharge}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-700">Cargo Security & Insurance Policy (5%)</td>
                    <td className="p-3 text-right font-mono">${insuranceFee}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-700">GST / Sales Tax (7%)</td>
                    <td className="p-3 text-right font-mono">${tax}</td>
                  </tr>
                  <tr className="bg-orange-50 font-bold text-sm">
                    <td className="p-3 text-slate-900">TOTAL DUE / PAID</td>
                    <td className="p-3 text-right font-mono text-orange-600">${totalPrice} USD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Full Cargo Loss Protection Guarantee by Josan Cover</span>
            </div>
            <p className="font-semibold text-slate-700">Thank you for choosing Josan Logistics!</p>
          </div>

        </div>

      </div>
    </div>
  );
};
