
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MockService } from '../services/mockDataService';
import { CommonArea, Booking, User, BookingStatus } from '../types';

interface FacilitiesProps {
  user: User | null;
}

const Facilities: React.FC<FacilitiesProps> = ({ user }) => {
  const [areas, setAreas] = useState<CommonArea[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [activeTab, setActiveTab] = useState<'areas' | 'my-bookings' | 'manage'>('areas');
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const a = await MockService.getCommonAreas();
    const b = await MockService.getBookings();
    setAreas(a);
    setBookings(b);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !user) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await MockService.createBooking({
        areaId: selectedArea.id,
        userId: user.id,
        unit: user.unit,
        date: bookingDate,
        startTime: bookingStart,
        endTime: bookingEnd,
        status: selectedArea.requiresApproval ? 'PENDING' : 'APPROVED'
      });
      
      setSuccessMsg(selectedArea.requiresApproval 
        ? "Solicitação enviada para aprovação!" 
        : "Reserva confirmada com sucesso!");
      
      loadData();
      // Reset form
      setBookingStart('');
      setBookingEnd('');
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    if (!user) return;
    await MockService.updateBookingStatus(bookingId, status, user.id);
    loadData();
  };

  const myBookings = bookings.filter(b => b.userId === user?.id);
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold">Aprovado</span>;
      case 'PENDING': return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold">Pendente</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">Rejeitado</span>;
      case 'CANCELLED': return <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-bold">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Espaços e Reservas</h1>
          <p className="text-slate-500">Agende áreas comuns, pague taxas e acompanhe suas solicitações.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('areas')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'areas' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             Reservar Área
           </button>
           <button 
             onClick={() => setActiveTab('my-bookings')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'my-bookings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             Minhas Reservas
           </button>
           {user?.role === 'MANAGER' && (
             <button 
               onClick={() => setActiveTab('manage')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'manage' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               Gerenciar ({pendingBookings.length})
             </button>
           )}
        </div>
      </div>

      {/* ERROR / SUCCESS MESSAGES */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <XCircle className="w-5 h-5 mr-2" /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> {successMsg}
        </div>
      )}

      {/* VIEW: AREAS LIST & BOOKING FORM */}
      {activeTab === 'areas' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* List of Areas */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {areas.map(area => (
              <div 
                key={area.id} 
                className={`bg-white rounded-xl border overflow-hidden transition-all cursor-pointer ${selectedArea?.id === area.id ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md' : 'border-slate-200 hover:shadow-lg'}`}
                onClick={() => { setSelectedArea(area); setSuccessMsg(''); setErrorMsg(''); }}
              >
                <div className="h-40 bg-slate-200 relative">
                  <img src={area.imageUrl} alt={area.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800">
                    {area.price > 0 ? `R$ ${area.price}` : 'Grátis'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{area.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-2 space-x-3">
                    <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {area.capacity} pessoas</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {area.openTime} - {area.closeTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{area.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                {selectedArea ? (
                  <form onSubmit={handleCreateBooking}>
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 text-emerald-600" />
                      Reservar {selectedArea.name}
                    </h3>

                    <div className="space-y-4">
                       <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 border border-slate-100">
                          <p><strong>Regras:</strong> {selectedArea.rules}</p>
                          <p className="mt-1"><strong>Limpeza:</strong> Intervalo de {selectedArea.cleaningInterval}h entre reservas.</p>
                       </div>

                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                          <input 
                            type="date" 
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingDate}
                            onChange={e => setBookingDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                            <input 
                              type="time" 
                              required
                              value={bookingStart}
                              onChange={e => setBookingStart(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                            <input 
                              type="time" 
                              required
                              value={bookingEnd}
                              onChange={e => setBookingEnd(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-sm font-medium text-slate-600">Total a Pagar</span>
                             <span className="text-xl font-bold text-emerald-600">
                               {selectedArea.price > 0 ? `R$ ${selectedArea.price.toFixed(2)}` : 'Isento'}
                             </span>
                          </div>

                          <button 
                            type="submit" 
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg"
                          >
                            Confirmar Reserva
                          </button>
                          {selectedArea.requiresApproval && (
                            <p className="text-xs text-center text-slate-400 mt-2">Sujeito à aprovação do síndico.</p>
                          )}
                       </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                     <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                     <p>Selecione uma área ao lado para iniciar a reserva.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* VIEW: MY BOOKINGS */}
      {activeTab === 'my-bookings' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
               <tr>
                 <th className="px-6 py-4">Área</th>
                 <th className="px-6 py-4">Data</th>
                 <th className="px-6 py-4">Horário</th>
                 <th className="px-6 py-4">Valor</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {myBookings.map(booking => {
                 const area = areas.find(a => a.id === booking.areaId);
                 return (
                   <tr key={booking.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-bold text-slate-800">{area?.name}</td>
                     <td className="px-6 py-4 text-slate-600">{new Date(booking.date).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-slate-600">{booking.startTime} - {booking.endTime}</td>
                     <td className="px-6 py-4 text-slate-600">{booking.totalPrice > 0 ? `R$ ${booking.totalPrice}` : 'Free'}</td>
                     <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                     <td className="px-6 py-4">
                       {booking.status === 'PENDING' || booking.status === 'APPROVED' ? (
                         <button 
                           onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                           className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                         >
                           Cancelar
                         </button>
                       ) : '-'}
                     </td>
                   </tr>
                 );
               })}
               {myBookings.length === 0 && (
                 <tr>
                   <td colSpan={6} className="text-center py-8 text-slate-500">Você não possui reservas.</td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      )}

      {/* VIEW: MANAGE (Admin) */}
      {activeTab === 'manage' && user?.role === 'MANAGER' && (
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                 <AlertCircle className="w-5 h-5 mr-2 text-amber-500" /> Solicitações Pendentes
              </h2>
              <div className="space-y-4">
                {pendingBookings.map(booking => {
                   const area = areas.find(a => a.id === booking.areaId);
                   return (
                     <div key={booking.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="mb-4 md:mb-0">
                           <p className="font-bold text-slate-800">{area?.name}</p>
                           <p className="text-sm text-slate-600">
                             <span className="font-medium">Unidade: {booking.unit}</span> • {new Date(booking.date).toLocaleDateString()} • {booking.startTime} às {booking.endTime}
                           </p>
                           <p className="text-xs text-slate-400 mt-1">Solicitado em: {new Date(booking.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                             className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-bold"
                           >
                             Rejeitar
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                             className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold shadow-sm"
                           >
                             Aprovar Reserva
                           </button>
                        </div>
                     </div>
                   );
                })}
                {pendingBookings.length === 0 && (
                  <p className="text-slate-500 italic">Nenhuma solicitação pendente no momento.</p>
                )}
              </div>
           </div>

           <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Relatórios de Ocupação</h3>
                <p className="text-slate-400 text-sm">Exporte o histórico completo de uso das áreas comuns.</p>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Baixar CSV
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Facilities;
