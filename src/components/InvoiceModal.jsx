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
    window.print();
  };

  const handleDownloadPDF = () => {
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice-${shipment.id}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0F172A; background: #fff; margin: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #F26722; padding-bottom: 20px; }
          .brand { font-size: 24px; font-weight: 800; color: #0F172A; }
          .brand span { color: #F26722; }
          .status { background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; }
          .title { font-size: 20px; font-weight: 800; margin-top: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 12px; font-size: 13px; }
          .card-title { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
          th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
          th { background: #F1F5F9; font-weight: 700; color: #334155; }
          .total { background: #FFF4EE; font-weight: 800; color: #F26722; font-size: 15px; }
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 12px; color: #64748B; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">JOSAN <span>LOGISTICS</span></div>
            <p style="font-size:12px; color:#64748B; margin:4px 0;">Global Freight & Supply Chain Management</p>
            <p style="font-size:12px; color:#64748B; margin:0;">450 Logistics Parkway, Chicago, IL 60607</p>
            <p style="font-size:12px; color:#64748B; margin:0;">Tax Reg ID: US-JOS-98210492</p>
          </div>
          <div style="text-align:right;">
            <span class="status">PAID & VERIFIED</span>
            <div class="title">INVOICE #${shipment.id}</div>
            <p style="font-size:12px; color:#64748B; margin:4px 0;">Date: ${shipment.createdDate || 'Aug 29, 2026'}</p>
            <p style="font-size:12px; color:#64748B; margin:0;">Payment Terms: Net 30</p>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">SHIP FROM (ORIGIN)</div>
            <strong>${shipment.sender}</strong>
            <p style="margin:4px 0; color:#475569;">${shipment.senderAddress || 'Origin Depot'}</p>
            <p style="margin:0; color:#64748B;">Hub: ${shipment.origin}</p>
          </div>
          <div class="card">
            <div class="card-title">SHIP TO (DESTINATION)</div>
            <strong>${shipment.receiver}</strong>
            <p style="margin:4px 0; color:#475569;">${shipment.receiverAddress || 'Destination Depot'}</p>
            <p style="margin:0; color:#64748B;">Hub: ${shipment.destination}</p>
          </div>
        </div>

        <h4 style="margin-bottom:6px; font-size:13px; text-transform:uppercase;">Freight Specifications</h4>
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
              <td style="font-weight:700; color:#F26722;">${shipment.serviceLevel}</td>
              <td>${shipment.cargoType}</td>
              <td>${shipment.weight} (${shipment.pieces || 1} Pcs)</td>
              <td>${shipment.declaredValue || '$10,000'}</td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-bottom:6px; font-size:13px; text-transform:uppercase;">Itemized Charges</h4>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Freight Transportation Fee</td>
              <td style="text-align:right;">$${basePriceNum.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Fuel Surcharge (8%)</td>
              <td style="text-align:right;">$${fuelSurcharge}</td>
            </tr>
            <tr>
              <td>Cargo Security & Insurance Policy (5%)</td>
              <td style="text-align:right;">$${insuranceFee}</td>
            </tr>
            <tr>
              <td>GST / Sales Tax (7%)</td>
              <td style="text-align:right;">$${tax}</td>
            </tr>
            <tr class="total">
              <td>TOTAL DUE / PAID</td>
              <td style="text-align:right;">$${totalPrice} USD</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div>🛡️ Full Cargo Loss Protection Guarantee by Josan Cover</div>
          <div>Thank you for choosing Josan Logistics!</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${shipment.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showToast) showToast(`Downloaded full Invoice #${shipment.id}`);
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
                <div className="w-9 h-9 rounded-lg bg-orange-gradient text-white flex items-center justify-center font-extrabold text-lg">
                  JL
                </div>
                <span className="text-2xl font-extrabold tracking-tight">JOSAN LOGISTICS</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">Global Freight & Supply Chain Management</p>
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
