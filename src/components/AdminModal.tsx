import React, { useState, useRef } from 'react';
import { MenuItem, Category } from '../types';
import { formatCLP, STORE_NAME, STORE_SLOGAN, STORE_LOGO } from '../data/menu';
import {
  X,
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  LogOut,
  Save,
  Search,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  FolderPlus,
  Trash2,
  Upload,
  Pencil,
  RotateCcw,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Layers,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categories: Category[];
  onUpdateMenuItem: (updatedItem: MenuItem) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onAddCategory: (newCategory: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onMoveMenuItem: (itemId: string, direction: 'up' | 'down') => void;
  onResetMenu: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  categories,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  onAddCategory,
  onDeleteCategory,
  onMoveCategory,
  onMoveMenuItem,
  onResetMenu,
}) => {
  if (!isOpen) return null;

  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation state
  const [activeTab, setActiveTab] = useState<'carta' | 'jerarquia' | 'nuevo_producto' | 'nueva_categoria'>('carta');
  const [jerarquiaCategory, setJerarquiaCategory] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Edit Existing Product state
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>(0);
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editHasCheeseSelection, setEditHasCheeseSelection] = useState(false);
  const [editIsBundle, setEditIsBundle] = useState(false);
  const [editBundleMaxSelections, setEditBundleMaxSelections] = useState<number | ''>(2);
  const [editBundleTitle, setEditBundleTitle] = useState('');
  const [editBundleAllowedItemIds, setEditBundleAllowedItemIds] = useState<string[]>([]);
  const [editBundleCategoryFilter, setEditBundleCategoryFilter] = useState<string>('todos');
  const [editError, setEditError] = useState('');
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete Confirmation state (in-app modal, avoids window.confirm blocked in iframes)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // New Product Form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.id || 'hamburguesas');
  const [newPrice, setNewPrice] = useState<number | ''>(8990);
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/hero_chaval_burgers_1792959833188.jpg');
  const [newHasCheeseSelection, setNewHasCheeseSelection] = useState(false);
  const [newIsBundle, setNewIsBundle] = useState(false);
  const [newBundleMaxSelections, setNewBundleMaxSelections] = useState<number | ''>(2);
  const [newBundleTitle, setNewBundleTitle] = useState('Elige tus 2 hamburguesas:');
  const [newBundleAllowedItemIds, setNewBundleAllowedItemIds] = useState<string[]>([]);
  const [newBundleCategoryFilter, setNewBundleCategoryFilter] = useState<string>('todos');
  const [formError, setFormError] = useState('');
  const newFileInputRef = useRef<HTMLInputElement | null>(null);

  // New Category Form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('🍔');
  const [categoryFormError, setCategoryFormError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'Chaval2026' && password === 'chavaladmin26') {
      setIsAuthenticated(true);
      setLoginError('');
      // Initialize temporary editing prices
      const initialPrices: Record<string, number> = {};
      menuItems.forEach((item) => {
        initialPrices[item.id] = item.price;
      });
      setEditingPrices(initialPrices);
    } else {
      setLoginError('Credenciales incorrectas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    setEditingProduct(null);
  };

  const handlePriceChange = (id: string, newP: number) => {
    setEditingPrices((prev) => ({
      ...prev,
      [id]: isNaN(newP) ? 0 : newP,
    }));
  };

  const handleSavePrice = (item: MenuItem) => {
    const updatedPrice = editingPrices[item.id];
    if (updatedPrice !== undefined && updatedPrice > 0) {
      onUpdateMenuItem({
        ...item,
        price: updatedPrice,
      });
      setSavedSuccessMessage(`Precio de "${item.name}" actualizado a ${formatCLP(updatedPrice)}`);
      setTimeout(() => setSavedSuccessMessage(null), 2500);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
    const nextAvailability = !item.isAvailable;
    onUpdateMenuItem({
      ...item,
      isAvailable: nextAvailability,
    });
    setSavedSuccessMessage(
      `"${item.name}" marcado como ${nextAvailability ? 'Disponible' : 'Agotado'}`
    );
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id;
    const name = itemToDelete.name;
    onDeleteMenuItem(id);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    setItemToDelete(null);
    setSavedSuccessMessage(`Producto "${name}" eliminado correctamente`);
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  // Open Edit Product Drawer/Modal
  const handleStartEditingProduct = (item: MenuItem) => {
    setEditingProduct(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.price);
    setEditDescription(item.description);
    setEditImage(item.image);
    setEditHasCheeseSelection(Boolean(item.hasCheeseSelection));
    setEditIsBundle(Boolean(item.bundleConfig?.enabled));
    setEditBundleMaxSelections(item.bundleConfig?.maxSelections || 2);
    setEditBundleTitle(item.bundleConfig?.title || 'Elige tus 2 hamburguesas:');
    setEditBundleAllowedItemIds(item.bundleConfig?.allowedItemIds || []);
    setEditBundleCategoryFilter('todos');
    setEditError('');
  };

  // Save Edited Product (photo, description, price, name, etc.)
  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editName.trim()) {
      setEditError('Por favor ingresa un nombre para el producto');
      return;
    }
    if (!editPrice || Number(editPrice) <= 0) {
      setEditError('Ingresa un precio válido en CLP');
      return;
    }
    if (!editDescription.trim()) {
      setEditError('Ingresa la descripción de los ingredientes');
      return;
    }
    if (editIsBundle) {
      if (!editBundleMaxSelections || Number(editBundleMaxSelections) <= 0) {
        setEditError('Ingresa una cantidad válida de productos a seleccionar (mínimo 1)');
        return;
      }
      if (editBundleAllowedItemIds.length === 0) {
        setEditError('Debes seleccionar al menos un producto disponible para que el cliente pueda elegir en la promoción');
        return;
      }
    }

    const updatedProduct: MenuItem = {
      ...editingProduct,
      name: editName.trim(),
      category: editCategory,
      price: Number(editPrice),
      description: editDescription.trim(),
      image: editImage || editingProduct.image,
      hasCheeseSelection: editHasCheeseSelection,
      bundleConfig: editIsBundle
        ? {
            enabled: true,
            maxSelections: Number(editBundleMaxSelections),
            allowedItemIds: editBundleAllowedItemIds,
            title: editBundleTitle.trim() || undefined,
          }
        : undefined,
    };

    onUpdateMenuItem(updatedProduct);
    setEditingPrices((prev) => ({
      ...prev,
      [updatedProduct.id]: updatedProduct.price,
    }));
    setSavedSuccessMessage(`¡Producto "${updatedProduct.name}" actualizado exitosamente!`);
    setEditingProduct(null);
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  // Image file upload handler for Editing
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setEditError('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image file upload handler for New Product
  const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Por favor ingresa un nombre para el producto');
      return;
    }
    if (!newPrice || Number(newPrice) <= 0) {
      setFormError('Ingresa un precio válido en CLP');
      return;
    }
    if (!newDescription.trim()) {
      setFormError('Ingresa una breve descripción de los ingredientes');
      return;
    }

    if (newIsBundle) {
      if (!newBundleMaxSelections || Number(newBundleMaxSelections) <= 0) {
        setFormError('Ingresa una cantidad válida de productos a seleccionar (mínimo 1)');
        return;
      }
      if (newBundleAllowedItemIds.length === 0) {
        setFormError('Debes seleccionar al menos un producto disponible para que el cliente pueda elegir en la promoción');
        return;
      }
    }

    const newProduct: MenuItem = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      price: Number(newPrice),
      description: newDescription.trim(),
      image: newImage,
      hasCheeseSelection: newHasCheeseSelection,
      bundleConfig: newIsBundle
        ? {
            enabled: true,
            maxSelections: Number(newBundleMaxSelections),
            allowedItemIds: newBundleAllowedItemIds,
            title: newBundleTitle.trim() || undefined,
          }
        : undefined,
      isAvailable: true,
    };

    onAddMenuItem(newProduct);

    // Reset form
    setNewName('');
    setNewPrice(8990);
    setNewDescription('');
    setNewHasCheeseSelection(false);
    setNewIsBundle(false);
    setNewBundleMaxSelections(2);
    setNewBundleTitle('Elige tus 2 hamburguesas:');
    setNewBundleAllowedItemIds([]);
    setNewBundleCategoryFilter('todos');
    setFormError('');
    setSavedSuccessMessage(`¡Producto "${newProduct.name}" agregado con éxito a la carta!`);
    setActiveTab('carta');
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  // Submit New Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryFormError('Ingresa un nombre para la categoría');
      return;
    }

    const catId = newCategoryName
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');

    if (categories.some((c) => c.id === catId)) {
      setCategoryFormError('Ya existe una categoría con ese nombre');
      return;
    }

    const createdCategory: Category = {
      id: catId,
      label: newCategoryName.trim(),
      icon: newCategoryIcon || '🍽️',
    };

    onAddCategory(createdCategory);
    setNewCategory(catId);
    setNewCategoryName('');
    setCategoryFormError('');
    setSavedSuccessMessage(`¡Categoría "${createdCategory.label}" creada exitosamente!`);
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  const filteredItems = menuItems.filter((i) =>
    i.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white text-stone-950 px-5 py-4 flex items-center justify-between border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Panel
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors font-semibold cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {savedSuccessMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedSuccessMessage}</span>
          </div>
        )}

        {/* Content */}
        {!isAuthenticated ? (
          /* ================= LOGIN FORM ================= */
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Usuario</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Contraseña</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-[0.99] cursor-pointer mt-2"
              >
                Ingresar
              </button>
            </form>
          </div>
        ) : editingProduct ? (
          /* ================= EDIT PRODUCT VIEW (PHOTOS, DESCRIPTIONS, ETC.) ================= */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-950 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la lista</span>
              </button>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Editando Producto Activo
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-stone-900 text-lg font-display">
                Editar: {editingProduct.name}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Modifica la foto, la descripción de ingredientes, el precio o la categoría.
              </p>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 max-w-lg">
              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Precio en CLP *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) =>
                        setEditPrice(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                      }
                      required
                      step="100"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>
                </div>
              </div>

              {/* Description editing (Requested by user) */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Descripción e Ingredientes *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Ingredientes detallados del producto..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Photo editing (Requested by user) */}
              <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/60 space-y-3">
                <label className="text-xs font-bold text-stone-800 block">
                  Foto del producto (Cambiar imagen)
                </label>

                <div className="flex items-center gap-3.5">
                  {/* Photo Preview */}
                  <div className="w-20 h-20 rounded-xl border-2 border-stone-200 overflow-hidden bg-white shrink-0 relative shadow-xs">
                    <img
                      src={editImage}
                      alt={editName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleEditFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>Subir nueva foto desde tu dispositivo</span>
                    </button>

                    <div className="text-[11px] text-stone-500">
                      O elige una foto predeterminada:
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {[
                          { label: 'Hamburguesa', path: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg' },
                          { label: 'Mechada', path: '/src/assets/images/mechada_sandwich_1792959834291.jpg' },
                          { label: 'Vegetariano', path: '/src/assets/images/veggie_dish_gourmet_1792959834727.jpg' },
                          { label: 'Bebida', path: '/src/assets/images/drink_coca_can_1792959926113.jpg' },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setEditImage(preset.path)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              editImage === preset.path
                                ? 'bg-amber-400 text-stone-950 border-amber-500'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cheese Selection Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editHasCheeseSelection}
                  onChange={(e) => setEditHasCheeseSelection(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-xs font-medium text-stone-700">
                  Permitir al cliente elegir tipo de queso (Chanco o Cheddar)
                </span>
              </label>

              {/* Bundle / Promo Configuration (Include other products & set quantity to select) */}
              <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-stone-900">
                  <input
                    type="checkbox"
                    checked={editIsBundle}
                    onChange={(e) => setEditIsBundle(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>🎁 Promoción o Combo con productos a elección (ej: Promo 2x1, Combo)</span>
                </label>

                {editIsBundle && (
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Cantidad a elegir por el cliente *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editBundleMaxSelections}
                            onChange={(e) =>
                              setEditBundleMaxSelections(
                                e.target.value === '' ? '' : parseInt(e.target.value, 10)
                              )
                            }
                            className="w-24 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-stone-900"
                          />
                          <span className="text-[11px] text-stone-500">productos</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Título de la selección (opcional)
                        </label>
                        <input
                          type="text"
                          value={editBundleTitle}
                          onChange={(e) => setEditBundleTitle(e.target.value)}
                          placeholder="Ej: Elige tus 2 hamburguesas:"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <label className="text-[11px] font-bold text-stone-700 block">
                          Productos que el cliente puede elegir:
                          <span className="ml-1 text-amber-700 font-bold">
                            ({editBundleAllowedItemIds.length} seleccionados)
                          </span>
                        </label>

                        {/* Quick filter by category */}
                        <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                          <button
                            type="button"
                            onClick={() => setEditBundleCategoryFilter('todos')}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              editBundleCategoryFilter === 'todos'
                                ? 'bg-amber-400 text-stone-950 border-amber-500'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            Todos
                          </button>
                          {categories.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setEditBundleCategoryFilter(c.id)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                editBundleCategoryFilter === c.id
                                  ? 'bg-amber-400 text-stone-950 border-amber-500'
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {c.icon} {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select all from filtered category button */}
                      <div className="flex justify-end gap-2 pb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const candidateItems = menuItems.filter(
                              (m) =>
                                m.id !== editingProduct?.id &&
                                (editBundleCategoryFilter === 'todos' ||
                                  m.category === editBundleCategoryFilter)
                            );
                            const idsToAdd = candidateItems.map((m) => m.id);
                            setEditBundleAllowedItemIds((prev) => [
                              ...prev,
                              ...idsToAdd.filter((id) => !prev.includes(id)),
                            ]);
                          }}
                          className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                        >
                          + Seleccionar todos de {editBundleCategoryFilter === 'todos' ? 'la lista' : 'esta categoría'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editBundleCategoryFilter === 'todos') {
                              setEditBundleAllowedItemIds([]);
                            } else {
                              const idsToRemove = menuItems
                                .filter((m) => m.category === editBundleCategoryFilter)
                                .map((m) => m.id);
                              setEditBundleAllowedItemIds((prev) =>
                                prev.filter((id) => !idsToRemove.includes(id))
                              );
                            }
                          }}
                          className="text-[10px] text-stone-500 hover:text-stone-700 font-medium cursor-pointer"
                        >
                          Desmarcar
                        </button>
                      </div>

                      {/* Checkbox item list */}
                      <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 bg-white border border-stone-200 rounded-xl">
                        {menuItems
                          .filter(
                            (m) =>
                              m.id !== editingProduct?.id &&
                              (editBundleCategoryFilter === 'todos' ||
                                m.category === editBundleCategoryFilter)
                          )
                          .map((p) => {
                            const isAllowed = editBundleAllowedItemIds.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer text-xs transition-colors ${
                                  isAllowed
                                    ? 'bg-amber-50/80 border-amber-400 font-bold text-stone-950'
                                    : 'bg-white border-stone-100 text-stone-700 hover:bg-stone-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isAllowed}
                                    onChange={() => {
                                      setEditBundleAllowedItemIds((prev) =>
                                        isAllowed
                                          ? prev.filter((id) => id !== p.id)
                                          : [...prev, p.id]
                                      );
                                    }}
                                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                                  />
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-7 h-7 rounded-md object-cover bg-stone-100 shrink-0"
                                  />
                                  <span className="truncate">{p.name}</span>
                                </div>
                                <span className="text-[11px] font-mono text-stone-500 font-normal shrink-0">
                                  {formatCLP(p.price)}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(editingProduct)}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Eliminar este producto de la carta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= ADMIN DASHBOARD TABS ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-2 border-amber-300 bg-white px-4 pt-2 gap-2 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('carta')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'carta'
                    ? 'border-amber-500 text-stone-950 bg-amber-50 font-black rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-stone-950'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>Gestión de Carta ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('jerarquia')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'jerarquia'
                    ? 'border-amber-500 text-stone-950 bg-amber-50 font-black rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-stone-950'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
                <span>🔃 Cambiar Orden</span>
              </button>

              <button
                onClick={() => setActiveTab('nuevo_producto')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'nuevo_producto'
                    ? 'border-amber-500 text-stone-950 bg-amber-50 font-black rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-stone-950'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>➕ Agregar Producto</span>
              </button>

              <button
                onClick={() => setActiveTab('nueva_categoria')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'nueva_categoria'
                    ? 'border-amber-500 text-stone-950 bg-amber-50 font-black rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-stone-950'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>🏷️ Crear Categoría</span>
              </button>
            </div>

            {/* Tab 1: Gestión de Carta */}
            {activeTab === 'carta' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Buscar producto por nombre..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900"
                    />
                  </div>

                  <button
                    onClick={onResetMenu}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium self-end sm:self-auto cursor-pointer"
                    title="Restablecer menú original"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restablecer Carta Original</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredItems.map((item) => {
                    const currentEditingPrice = editingPrices[item.id] ?? item.price;
                    const isAvailable = item.isAvailable !== false;
                    const itemCat = categories.find((c) => c.id === item.category);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isAvailable
                            ? 'bg-white border-stone-200 hover:border-amber-300'
                            : 'bg-stone-100/70 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-stone-500 uppercase font-semibold">
                              {itemCat ? `${itemCat.icon} ${itemCat.label}` : item.category}
                            </span>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Controls: Edit (Photo/Desc), Price input, Availability & Delete */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap sm:flex-nowrap">
                          {/* Complete Edit button (Photo, Description, etc.) */}
                          <button
                            type="button"
                            onClick={() => handleStartEditingProduct(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                            title="Editar foto, descripción y detalles"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span>Editar</span>
                          </button>

                          {/* Quick Price input */}
                          <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1">
                            <span className="text-xs font-bold text-stone-400">$</span>
                            <input
                              type="number"
                              value={currentEditingPrice}
                              onChange={(e) =>
                                handlePriceChange(item.id, parseInt(e.target.value, 10))
                              }
                              className="w-20 text-xs font-mono font-bold text-stone-900 bg-transparent focus:outline-hidden text-right"
                              step="100"
                            />
                            <span className="text-[10px] text-stone-400 font-bold">CLP</span>
                          </div>

                          {/* Save price button */}
                          <button
                            onClick={() => handleSavePrice(item)}
                            className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold transition-colors cursor-pointer"
                            title="Guardar precio rápido"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle available/out of stock */}
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isAvailable ? 'Disponible' : 'Agotado'}
                          </button>

                          {/* Order buttons: Up / Down */}
                          <div className="flex items-center gap-0.5 bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                            <button
                              type="button"
                              onClick={() => {
                                onMoveMenuItem(item.id, 'up');
                                setSavedSuccessMessage(`"${item.name}" subió de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              className="p-1 rounded-lg hover:bg-amber-400 hover:text-stone-950 text-stone-600 transition-colors cursor-pointer"
                              title="Subir producto en jerarquía"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onMoveMenuItem(item.id, 'down');
                                setSavedSuccessMessage(`"${item.name}" bajó de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              className="p-1 rounded-lg hover:bg-amber-400 hover:text-stone-950 text-stone-600 transition-colors cursor-pointer"
                              title="Bajar producto en jerarquía"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete item button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item);
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Eliminar "${item.name}"`}
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Orden y Jerarquía */}
            {activeTab === 'jerarquia' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                {/* Section 1: Categories Hierarchy */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2 font-display">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span>Jerarquía de Categorías</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        El orden aquí define cómo aparecen las categorías en la barra superior y en el catálogo.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full shrink-0">
                      {categories.length} categorías
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {categories.map((c, idx) => {
                      const count = menuItems.filter((i) => i.category === c.id).length;
                      return (
                        <div
                          key={c.id}
                          className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-amber-400 text-stone-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-lg shrink-0">{c.icon}</span>
                            <div className="min-w-0">
                              <span className="font-bold text-stone-900 text-xs sm:text-sm block truncate">
                                {c.label}
                              </span>
                              <span className="text-[11px] text-stone-400 block">
                                {count} {count === 1 ? 'producto' : 'productos'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onMoveCategory(c.id, 'up');
                                setSavedSuccessMessage(`Categoría "${c.label}" subió de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === 0}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-100 text-stone-700 hover:text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Subir categoría"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Subir</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onMoveCategory(c.id, 'down');
                                setSavedSuccessMessage(`Categoría "${c.label}" bajó de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === categories.length - 1}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-100 text-stone-700 hover:text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Bajar categoría"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Bajar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Products Hierarchy */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2 font-display">
                      <ArrowUpDown className="w-4 h-4 text-amber-600" />
                      <span>Jerarquía de Productos</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Cambia el orden en que se presentan los productos a tus clientes dentro de su sección.
                    </p>
                  </div>

                  {/* Filter category pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                    <button
                      type="button"
                      onClick={() => setJerarquiaCategory('todos')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                        jerarquiaCategory === 'todos'
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      Todos ({menuItems.length})
                    </button>
                    {categories.map((cat) => {
                      const count = menuItems.filter((i) => i.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setJerarquiaCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                            jerarquiaCategory === cat.id
                              ? 'bg-amber-400 text-stone-950 shadow-xs'
                              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                          <span className="opacity-70 text-[10px]">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Products list for ordering */}
                  <div className="space-y-1.5 pt-1">
                    {(jerarquiaCategory === 'todos'
                      ? menuItems
                      : menuItems.filter((i) => i.category === jerarquiaCategory)
                    ).map((item, idx, arr) => {
                      const cat = categories.find((c) => c.id === item.category);

                      return (
                        <div
                          key={item.id}
                          className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                <span>{cat ? `${cat.icon} ${cat.label}` : item.category}</span>
                                <span>•</span>
                                <span className="font-mono font-semibold text-stone-700">
                                  {formatCLP(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onMoveMenuItem(item.id, 'up');
                                setSavedSuccessMessage(`"${item.name}" subió de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === 0}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-100 text-stone-700 hover:text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Subir producto"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Subir</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onMoveMenuItem(item.id, 'down');
                                setSavedSuccessMessage(`"${item.name}" bajó de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === arr.length - 1}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-100 text-stone-700 hover:text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Bajar producto"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Bajar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Agregar Nuevo Producto */}
            {activeTab === 'nuevo_producto' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base font-display">
                    Agregar Nuevo Producto a la Carta
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Completa la información, elige la categoría y sube una foto. Se publicará inmediatamente en la página.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-4 max-w-lg">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Nombre del producto *
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ej: Hamburguesa Suprema Cheddar"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  {/* Category and Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Categoría *
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Precio en CLP *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                          $
                        </span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) =>
                            setNewPrice(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                          }
                          placeholder="8990"
                          required
                          step="100"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Descripción de ingredientes *
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Ej: Hamburguesa de 150 gr con queso chanco derretido, champiñones salteados..."
                      rows={2}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  {/* Photo selection / upload */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Foto del producto
                    </label>

                    <div className="flex items-center gap-3">
                      {/* Preview */}
                      <div className="w-16 h-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 shrink-0 relative">
                        <img
                          src={newImage}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        {/* File input button */}
                        <input
                          type="file"
                          ref={newFileInputRef}
                          onChange={handleNewFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => newFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-600" />
                          <span>Subir foto desde dispositivo</span>
                        </button>

                        <div className="text-[11px] text-stone-500">
                          O elige una imagen predeterminada:
                          <div className="flex gap-1.5 mt-1">
                            {[
                              { label: 'Hamburguesa', path: '/src/assets/images/hero_chaval_burgers_1792959833188.jpg' },
                              { label: 'Mechada', path: '/src/assets/images/mechada_sandwich_1792959834291.jpg' },
                              { label: 'Vegetariano', path: '/src/assets/images/veggie_dish_gourmet_1792959834727.jpg' },
                              { label: 'Bebida', path: '/src/assets/images/drink_coca_can_1792959926113.jpg' },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setNewImage(preset.path)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                  newImage === preset.path
                                    ? 'bg-amber-400 text-stone-950 border-amber-500'
                                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cheese Selection Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={newHasCheeseSelection}
                      onChange={(e) => setNewHasCheeseSelection(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-medium text-stone-700">
                      Permitir al cliente elegir tipo de queso (Chanco o Cheddar)
                    </span>
                  </label>

                  {/* Bundle / Promo Configuration for New Product */}
                  <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-stone-900">
                      <input
                        type="checkbox"
                        checked={newIsBundle}
                        onChange={(e) => setNewIsBundle(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span>🎁 Promoción o Combo con productos a elección (ej: Promo 2x1, Combo)</span>
                    </label>

                    {newIsBundle && (
                      <div className="space-y-3 pt-2 border-t border-stone-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-stone-700 block mb-1">
                              Cantidad a elegir por el cliente *
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={newBundleMaxSelections}
                                onChange={(e) =>
                                  setNewBundleMaxSelections(
                                    e.target.value === '' ? '' : parseInt(e.target.value, 10)
                                  )
                                }
                                className="w-24 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-stone-900"
                              />
                              <span className="text-[11px] text-stone-500">productos</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-stone-700 block mb-1">
                              Título de la selección (opcional)
                            </label>
                            <input
                              type="text"
                              value={newBundleTitle}
                              onChange={(e) => setNewBundleTitle(e.target.value)}
                              placeholder="Ej: Elige tus 2 hamburguesas:"
                              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                            <label className="text-[11px] font-bold text-stone-700 block">
                              Productos que el cliente puede elegir:
                              <span className="ml-1 text-amber-700 font-bold">
                                ({newBundleAllowedItemIds.length} seleccionados)
                              </span>
                            </label>

                            {/* Quick filter by category */}
                            <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                              <button
                                type="button"
                                onClick={() => setNewBundleCategoryFilter('todos')}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                  newBundleCategoryFilter === 'todos'
                                    ? 'bg-amber-400 text-stone-950 border-amber-500'
                                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                                }`}
                              >
                                Todos
                              </button>
                              {categories.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setNewBundleCategoryFilter(c.id)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                    newBundleCategoryFilter === c.id
                                      ? 'bg-amber-400 text-stone-950 border-amber-500'
                                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                                  }`}
                                >
                                  {c.icon} {c.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Select all from filtered category button */}
                          <div className="flex justify-end gap-2 pb-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const candidateItems = menuItems.filter(
                                  (m) =>
                                    newBundleCategoryFilter === 'todos' ||
                                    m.category === newBundleCategoryFilter
                                );
                                const idsToAdd = candidateItems.map((m) => m.id);
                                setNewBundleAllowedItemIds((prev) => [
                                  ...prev,
                                  ...idsToAdd.filter((id) => !prev.includes(id)),
                                ]);
                              }}
                              className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                            >
                              + Seleccionar todos de {newBundleCategoryFilter === 'todos' ? 'la lista' : 'esta categoría'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (newBundleCategoryFilter === 'todos') {
                                  setNewBundleAllowedItemIds([]);
                                } else {
                                  const idsToRemove = menuItems
                                    .filter((m) => m.category === newBundleCategoryFilter)
                                    .map((m) => m.id);
                                  setNewBundleAllowedItemIds((prev) =>
                                    prev.filter((id) => !idsToRemove.includes(id))
                                  );
                                }
                              }}
                              className="text-[10px] text-stone-500 hover:text-stone-700 font-medium cursor-pointer"
                            >
                              Desmarcar
                            </button>
                          </div>

                          {/* Checkbox item list */}
                          <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 bg-white border border-stone-200 rounded-xl">
                            {menuItems
                              .filter(
                                (m) =>
                                  newBundleCategoryFilter === 'todos' ||
                                  m.category === newBundleCategoryFilter
                              )
                              .map((p) => {
                                const isAllowed = newBundleAllowedItemIds.includes(p.id);
                                return (
                                  <label
                                    key={p.id}
                                    className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer text-xs transition-colors ${
                                      isAllowed
                                        ? 'bg-amber-50/80 border-amber-400 font-bold text-stone-950'
                                        : 'bg-white border-stone-100 text-stone-700 hover:bg-stone-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={isAllowed}
                                        onChange={() => {
                                          setNewBundleAllowedItemIds((prev) =>
                                            isAllowed
                                              ? prev.filter((id) => id !== p.id)
                                              : [...prev, p.id]
                                          );
                                        }}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                                      />
                                      <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-7 h-7 rounded-md object-cover bg-stone-100 shrink-0"
                                      />
                                      <span className="truncate">{p.name}</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-stone-500 font-normal shrink-0">
                                      {formatCLP(p.price)}
                                    </span>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-3"
                  >
                    Guardar y Publicar Producto
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Crear Nueva Categoría */}
            {activeTab === 'nueva_categoria' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base font-display">
                    Crear Nueva Categoría
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Crea secciones como "Postres", "Acompañamientos", "Combos", etc.
                  </p>
                </div>

                {categoryFormError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{categoryFormError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateCategory} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ej: Postres Caseros"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Emoji o Ícono
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                        placeholder="🍔"
                        maxLength={4}
                        className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-center text-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                      />
                      <div className="flex gap-1.5 flex-wrap">
                        {['🍔', '🥪', '🥗', '🥤', '🍟', '🍰', '🥩', '🧀', '🥑', '🍕', '🌮'].map(
                          (emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setNewCategoryIcon(emoji)}
                              className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-base cursor-pointer"
                            >
                              {emoji}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Guardar Categoría
                  </button>
                </form>

                {/* List of existing categories */}
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                    Categorías Activas ({categories.length})
                  </h4>
                  <div className="space-y-1.5">
                    {categories.map((c, idx) => {
                      const count = menuItems.filter((i) => i.category === c.id).length;
                      return (
                        <div
                          key={c.id}
                          className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 font-bold text-stone-900">
                            <span className="w-5 h-5 rounded-md bg-stone-200 text-stone-700 text-[10px] font-mono flex items-center justify-center font-bold">
                              #{idx + 1}
                            </span>
                            <span className="text-base">{c.icon}</span>
                            <span>{c.label}</span>
                            <span className="text-stone-400 font-normal">
                              ({count} productos)
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onMoveCategory(c.id, 'up');
                                setSavedSuccessMessage(`Categoría "${c.label}" subió de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === 0}
                              className="p-1 rounded-lg border border-stone-200 bg-white hover:bg-amber-100 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Subir categoría"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onMoveCategory(c.id, 'down');
                                setSavedSuccessMessage(`Categoría "${c.label}" bajó de posición`);
                                setTimeout(() => setSavedSuccessMessage(null), 1500);
                              }}
                              disabled={idx === categories.length - 1}
                              className="p-1 rounded-lg border border-stone-200 bg-white hover:bg-amber-100 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Bajar categoría"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {count === 0 && (
                              <button
                                type="button"
                                onClick={() => onDeleteCategory(c.id)}
                                className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer ml-1"
                                title="Eliminar categoría vacía"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* In-App Delete Confirmation Modal (no window.confirm, safe in iframe) */}
        {itemToDelete && (
          <div
            className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setItemToDelete(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm">¿Eliminar producto?</h4>
                  <p className="text-[11px] text-stone-500">Se quitará de la carta inmediatamente</p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center gap-3">
                <img
                  src={itemToDelete.image}
                  alt={itemToDelete.name}
                  className="w-11 h-11 rounded-lg object-cover bg-stone-200 shrink-0 border border-stone-200"
                />
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 text-xs block truncate">
                    {itemToDelete.name}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 font-semibold block">
                    {formatCLP(itemToDelete.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sí, eliminar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
