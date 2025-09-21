"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, ShoppingCart, User, Package, Wallet, Star, Filter, Eye, Plus, Minus, CreditCard, Bitcoin, Truck, Clock, CheckCircle } from 'lucide-react'

// Tipos de dados
interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
  rating: number
  inStock: boolean
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface User {
  id: number
  name: string
  email: string
  isLoggedIn: boolean
}

interface Order {
  id: number
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  items: CartItem[]
  paymentMethod: string
}

// Dados mock dos produtos farmacêuticos - DESCRIÇÕES MELHORADAS
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 12.99,
    category: "Analgésicos",
    description: "Analgésico e antitérmico eficaz para alívio rápido de dores de cabeça, dores musculares, dores nas costas e redução da febre. Fórmula de ação rápida com efeito prolongado por até 6 horas.",
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Vitamina D3 2000UI",
    price: 29.99,
    category: "Vitaminas",
    description: "Suplemento essencial para fortalecimento dos ossos, dentes e sistema imunológico. Auxilia na absorção de cálcio e fósforo, prevenindo osteoporose e melhorando a saúde cardiovascular. Ideal para quem tem pouca exposição solar.",
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Omeprazol 20mg",
    price: 18.50,
    category: "Digestivos",
    description: "Protetor gástrico de última geração que reduz a produção de ácido no estômago. Indicado para tratamento de úlceras, gastrite, refluxo gastroesofágico e síndrome de Zollinger-Ellison. Alívio duradouro por 24 horas.",
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Dipirona 500mg",
    price: 8.99,
    category: "Analgésicos",
    description: "Analgésico e antitérmico de ação rápida e potente para dores intensas e febre alta. Eficaz contra dores de cabeça, enxaqueca, cólicas, dores pós-operatórias e estados febris. Início de ação em 15-30 minutos.",
    rating: 4.6,
    inStock: false,
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Complexo B",
    price: 24.99,
    category: "Vitaminas",
    description: "Fórmula completa com todas as 8 vitaminas do complexo B (B1, B2, B3, B5, B6, B7, B9, B12). Essencial para energia celular, metabolismo, sistema nervoso saudável, formação de glóbulos vermelhos e manutenção da pele, cabelos e unhas. Combate o cansaço e melhora o humor.",
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Probióticos Premium",
    price: 45.99,
    category: "Suplementos",
    description: "Blend avançado com 10 bilhões de UFC de probióticos vivos incluindo Lactobacillus e Bifidobacterium. Restaura e mantém a flora intestinal saudável, fortalece o sistema imunológico, melhora a digestão e absorção de nutrientes. Com prebióticos para potencializar os efeitos.",
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop"
  }
]

const categories = ["Todos", "Analgésicos", "Vitaminas", "Digestivos", "Suplementos"]

export default function MyDrugs() {
  // Estados principais
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'cart' | 'orders' | 'product'>('home')
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [showPayment, setShowPayment] = useState(false)

  // Estados do formulário - OTIMIZADOS para evitar re-renders desnecessários
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '' })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('mydrugs_user')
    const savedCart = localStorage.getItem('mydrugs_cart')
    const savedOrders = localStorage.getItem('mydrugs_orders')

    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedOrders) setOrders(JSON.parse(savedOrders))
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (user) localStorage.setItem('mydrugs_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('mydrugs_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('mydrugs_orders', JSON.stringify(orders))
  }, [orders])

  // Filtrar produtos
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  // Handlers otimizados com useCallback para evitar re-renders
  const handleLoginEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({ ...prev, email: e.target.value }))
  }, [])

  const handleLoginPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({ ...prev, password: e.target.value }))
  }, [])

  const handleRegisterEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm(prev => ({ ...prev, email: e.target.value }))
  }, [])

  const handleRegisterPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm(prev => ({ ...prev, password: e.target.value }))
  }, [])

  // Funções de autenticação - OTIMIZADAS
  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email && loginForm.password) {
      const newUser: User = {
        id: Date.now(),
        name: loginForm.email.split('@')[0],
        email: loginForm.email,
        isLoggedIn: true
      }
      setUser(newUser)
      setCurrentView('home')
      setLoginForm({ email: '', password: '' })
    }
  }, [loginForm])

  const handleRegister = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.email && registerForm.password) {
      const newUser: User = {
        id: Date.now(),
        name: registerForm.email.split('@')[0],
        email: registerForm.email,
        isLoggedIn: true
      }
      setUser(newUser)
      setCurrentView('home')
      setRegisterForm({ email: '', password: '' })
    }
  }, [registerForm])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mydrugs_user')
    setCurrentView('home')
  }

  // Funções do carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Função de checkout - SIMPLIFICADA
  const handleCheckout = (paymentMethod: string) => {
    if (cart.length === 0 || !user) return

    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      total: getTotalPrice(),
      status: 'pending',
      items: [...cart],
      paymentMethod
    }

    setOrders([newOrder, ...orders])
    setCart([])
    setShowPayment(false)
    setCurrentView('orders')
  }

  // Componente Header com nova logo
  const Header = () => (
    <header className="bg-black text-white shadow-2xl border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/cd3a4572-9892-4d76-bb2b-cb7c5a3706ab.png" 
              alt="MyDrugs Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                MYDRUGS
              </h1>
              <p className="text-xs text-purple-400 font-light">
                Innovation | Health | Future
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setCurrentView('cart')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentView('orders')}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 p-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Truck className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm font-medium"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )

  // Componente de Login - OTIMIZADO
  const LoginView = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeito de partículas de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/2 w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative z-10">
        <div className="text-center mb-8">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/cd3a4572-9892-4d76-bb2b-cb7c5a3706ab.png" 
            alt="MyDrugs Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">
            MYDRUGS
          </h2>
          <p className="text-purple-400 text-sm font-light">
            Innovation | Health | Future
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={loginForm.email}
              onChange={handleLoginEmailChange}
              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              placeholder="Email"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              value={loginForm.password}
              onChange={handleLoginPasswordChange}
              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              placeholder="Senha"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Entrar Agora
          </button>
        </form>
        <p className="text-white/70 text-center mt-6">
          Não tem conta?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  )

  // Componente de Registro - ULTRA OTIMIZADO
  const RegisterView = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeito de partículas de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/2 w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative z-10">
        <div className="text-center mb-8">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/cd3a4572-9892-4d76-bb2b-cb7c5a3706ab.png" 
            alt="MyDrugs Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">
            MYDRUGS
          </h2>
          <p className="text-purple-400 text-sm font-light">
            Innovation | Health | Future
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <input
              type="email"
              value={registerForm.email}
              onChange={handleRegisterEmailChange}
              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              placeholder="Email"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              value={registerForm.password}
              onChange={handleRegisterPasswordChange}
              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              placeholder="Senha"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Cadastrar Agora
          </button>
        </form>
        <p className="text-white/70 text-center mt-6">
          Já tem conta?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
          >
            Entre aqui
          </button>
        </p>
      </div>
    </div>
  )

  // Componente Home
  const HomeView = () => (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-black to-blue-900 py-16 relative overflow-hidden">
        {/* Efeito de partículas */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-32 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Farmácia do <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Futuro</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Produtos farmacêuticos de qualidade com pagamentos em criptomoedas. Seguro, rápido e inovador.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-white/60 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setCurrentView('product')
                    }}
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </button>
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Fora de Estoque
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white/80 text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Componente de Produto Individual
  const ProductView = () => {
    if (!selectedProduct) return null

    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            ← Voltar
          </button>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm px-3 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-4">{selectedProduct.name}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white/80">({selectedProduct.rating})</span>
                  </div>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">{selectedProduct.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    R$ {selectedProduct.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.inStock
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedProduct.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    addToCart(selectedProduct)
                    setCurrentView('cart')
                  }}
                  disabled={!selectedProduct.inStock}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                >
                  {selectedProduct.inStock ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Componente do Carrinho
  const CartView = () => (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Carrinho de Compras
        </h2>
        
        {cart.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
            <ShoppingCart className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-lg">Seu carrinho está vazio</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-white/70">{item.category}</p>
                      <p className="text-green-400 font-bold">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-all duration-300"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-white font-bold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-2 rounded-lg transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-fit border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-white/80">
                    <span>{item.name} x{item.quantity}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 pt-4 mb-6">
                <div className="flex justify-between text-white font-bold text-xl">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              
              {user ? (
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Finalizar Compra
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Fazer Login para Comprar
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Modal de Pagamento - SIMPLIFICADO */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Pagamento Rápido</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout('Bitcoin')}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <Bitcoin className="h-6 w-6" />
                  <span>Bitcoin</span>
                </button>
                <button
                  onClick={() => handleCheckout('Ethereum')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <Wallet className="h-6 w-6" />
                  <span>Ethereum</span>
                </button>
                <button
                  onClick={() => handleCheckout('Cartão')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Cartão</span>
                </button>
              </div>
              <button
                onClick={() => setShowPayment(false)}
                className="w-full mt-4 bg-gray-500/20 hover:bg-gray-500/30 text-white py-3 px-4 rounded-xl transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Componente de Pedidos
  const OrdersView = () => (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Meus Pedidos
        </h2>
        
        {orders.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
            <Package className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-lg">Você ainda não fez nenhum pedido</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Começar a Comprar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Pedido #{order.id}</h3>
                    <p className="text-white/70">Data: {order.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {order.status === 'pending' && <><Clock className="h-4 w-4 inline mr-1" />Pendente</>}
                      {order.status === 'processing' && <><Package className="h-4 w-4 inline mr-1" />Processando</>}
                      {order.status === 'shipped' && <><Truck className="h-4 w-4 inline mr-1" />Enviado</>}
                      {order.status === 'delivered' && <><CheckCircle className="h-4 w-4 inline mr-1" />Entregue</>}
                    </span>
                    <span className="text-green-400 font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map(item => (
                    <div key={item.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-white/70 text-sm">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-white/70">Pagamento: {order.paymentMethod}</span>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm">
                    Rastrear Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Renderização principal
  return (
    <div className="font-inter">
      {currentView === 'home' && <HomeView />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'register' && <RegisterView />}
      {currentView === 'cart' && <CartView />}
      {currentView === 'orders' && <OrdersView />}
      {currentView === 'product' && <ProductView />}
    </div>
  )
}