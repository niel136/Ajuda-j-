import React from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import { Bell, MapPin, Tag, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useApp();
  const { permission, requestPermission, preferences, updatePreferences } = useNotification();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <img 
          src={user.avatarUrl || 'https://picsum.photos/100/100'} 
          alt={user.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase">
            {user.role === 'admin' ? 'Administrador' : 'Voluntário'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center">
            <Bell size={20} className="mr-2 text-blue-600" /> Preferências de Notificação
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Status das Notificações</p>
              <p className="text-sm text-slate-500">
                {permission === 'granted' ? 'Ativo e funcionando.' : 
                 permission === 'denied' ? 'Bloqueado no navegador.' : 'Ainda não ativado.'}
              </p>
            </div>
            {permission !== 'granted' && (
              <Button size="sm" onClick={requestPermission}>Ativar</Button>
            )}
            {permission === 'granted' && (
              <span className="text-green-600 font-bold text-sm flex items-center"><Shield size={14} className="mr-1"/> Ativado</span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Eu quero saber quando...</h3>
            
            <label className="flex items-start cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                checked={preferences.newRequestsNearby}
                onChange={e => updatePreferences({ newRequestsNearby: e.target.checked })}
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-slate-700">Novos pedidos próximos a mim</span>
                <span className="block text-xs text-slate-500">Alertas baseados na sua localização atual.</span>
              </div>
            </label>

            <label className="flex items-start cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                checked={preferences.myRequestUpdates}
                onChange={e => updatePreferences({ myRequestUpdates: e.target.checked })}
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-slate-700">Atualizações nos meus pedidos</span>
                <span className="block text-xs text-slate-500">Quando receber uma doação ou aprovação.</span>
              </div>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
               <Tag size={14} className="mr-1"/> Interesses de Causa
             </h3>
             <div className="flex flex-wrap gap-2">
               {['Alimentação', 'Saúde', 'Reforma', 'Educação'].map(cat => (
                 <button
                   key={cat}
                   onClick={() => {
                     const current = preferences.categories;
                     const newCats = current.includes(cat) 
                       ? current.filter(c => c !== cat)
                       : [...current, cat];
                     updatePreferences({ categories: newCats });
                   }}
                   className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                     preferences.categories.includes(cat)
                       ? 'bg-blue-100 text-blue-800 border-blue-200'
                       : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      <Button variant="outline" fullWidth className="text-red-600 border-red-100 hover:bg-red-50" onClick={handleLogout}>
        <LogOut size={18} className="mr-2" /> Sair da conta
      </Button>
      
      <div className="text-center text-xs text-slate-400">
        Versão 1.0.0 • Feito com ❤️ para o Brasil
      </div>
    </div>
  );
};

export default Profile;