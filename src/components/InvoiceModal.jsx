import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { X, Printer, Download, Truck, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export const InvoiceModal = () => {
  const { selectedInvoiceShipment, setSelectedInvoiceShipment } = useLogistics();

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Action Controls Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-sm">Official Freight Bill & Invoice</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
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
