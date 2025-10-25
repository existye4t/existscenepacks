import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, LogIn, LogOut, Film, Tv, Gamepad2, Grid3x3, X } from 'lucide-react';

export default function ExistScenePacks() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    category: 'movies',
    description: '',
    year: '',
    imdb: '',
    downloadLink: ''
  });

  const ADMIN_PASSWORD = 'exist1881';

  useEffect(() => {
    const saved = localStorage.getItem('scenepacks_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const defaultItems = [
        {
          id: 1,
          title: "Breaking Bad",
          poster: "https://images.unsplash.com/photo-1574267432644-f9485d7a74c0?w=500",
          category: "series",
          description: "Kimya öğretmeni Walter White'ın metamfetamin üreticisine dönüşme hikayesi",
          year: "2008-2013",
          imdb: "9.5",
          downloadLink: "#"
        },
        {
          id: 2,
          title: "The Dark Knight",
          poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
          category: "movies",
          description: "Batman, Joker ile karşı karşıya gelir",
          year: "2008",
          imdb: "9.0",
          downloadLink: "#"
        },
        {
          id: 3,
          title: "The Last of Us",
          poster: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500",
          category: "games",
          description: "Post-apokaliptik dünyada hayatta kalma oyunu",
          year: "2013",
          imdb: "9.8",
          downloadLink: "#"
        }
      ];
      setItems(defaultItems);
      localStorage.setItem('scenepacks_items', JSON.stringify(defaultItems));
    }
  }, []);

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('scenepacks_items', JSON.stringify(newItems));
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert('Yanlış şifre!');
      setPassword('');
    }
  };

  const handleAddItem = () => {
    console.log('Ekle butonuna basıldı');
    console.log('Form data:', formData);
    
    if (!formData.title || !formData.poster) {
      alert('Başlık ve poster zorunludur!');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData
    };

    console.log('Yeni item:', newItem);
    const updatedItems = [...items, newItem];
    console.log('Güncel items:', updatedItems);
    
    saveItems(updatedItems);
    setShowAddModal(false);
    resetForm();
    alert('İçerik başarıyla eklendi!');
  };

  const handleEditItem = () => {
    const updatedItems = items.map(item => 
      item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
    );
    saveItems(updatedItems);
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      saveItems(items.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      poster: '',
      category: 'movies',
      description: '',
      year: '',
      imdb: '',
      downloadLink: ''
    });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Tümü', icon: Grid3x3 },
    { id: 'movies', name: 'Filmler', icon: Film },
    { id: 'series', name: 'Diziler', icon: Tv },
    { id: 'games', name: 'Oyunlar', icon: Gamepad2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              existscenepacks.com
            </h1>
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <>
                  <span className="text-green-400 text-sm">Admin Modu</span>
                  <button
                    onClick={() => setIsAdmin(false)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    Çıkış
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogIn size={18} />
                  Admin Girişi
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Plus size={20} />
                Yeni Ekle
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all group">
              <div className="relative">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-80 object-cover"
                />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                {item.imdb && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-sm">
                    ⭐ {item.imdb}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                {item.year && <p className="text-gray-400 text-sm mb-2">{item.year}</p>}
                {item.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                )}
                <a
                  href={item.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  İndir
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">İçerik bulunamadı</p>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Admin Girişi</h2>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setPassword('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Şifrenizi girin"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Örn: Breaking Bad"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Poster URL *</label>
                <input
                  type="text"
                  value={formData.poster}
                  onChange={(e) => setFormData({...formData, poster: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="movies">Filmler</option>
                  <option value="series">Diziler</option>
                  <option value="games">Oyunlar</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Kısa açıklama..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Yıl</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">IMDb Puanı</label>
                  <input
                    type="text"
                    value={formData.imdb}
                    onChange={(e) => setFormData({...formData, imdb: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="9.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">İndirme Linki</label>
                <input
                  type="text"
                  value={formData.downloadLink}
                  onChange={(e) => setFormData({...formData, downloadLink: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>

              <button
                onClick={editingItem ? handleEditItem : handleAddItem}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                {editingItem ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}