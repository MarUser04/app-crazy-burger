import Vue from 'vue'
import Router from 'vue-router'
import authGuard from '@/authGuard'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      // Dashboard
      {
        name: 'Inicio',
        path: '',
        component: () => import('@/views/dashboard/Dashboard')
      },
      {
        name: 'Ordenes',
        path: 'ordenes',
        component: () => import('@/views/dashboard/tables/Ordenes')
      },
      {
        name: 'Orden Form',
        path: 'ordenes/form',
        component: () => import('@/views/dashboard/pages/OrdenForm'),
        meta: {
          requireAdmin: true
        }
      },
      {
        name: 'Orden Form',
        path: 'ordenes/form/:id',
        component: () => import('@/views/dashboard/pages/OrdenForm')
      },
      {
        name: 'Productos',
        path: 'productos',
        component: () => import('@/views/dashboard/tables/Productos')
      },
      {
        name: 'Productos Form',
        path: 'productos/form',
        component: () => import('@/views/dashboard/pages/ProductForm'),
        meta: {
          requireAdmin: true
        }
      },
      {
        name: 'Editar Producto',
        path: 'product/form/:id',
        component: () => import('@/views/dashboard/pages/ProductForm')
      },
      {
        name: 'Inventario',
        path: 'inventario',
        component: () => import('@/views/dashboard/tables/Inventario')
      },
      {
        name: 'Crear Item',
        path: 'inventario/form',
        component: () => import('@/views/dashboard/pages/InventarioForm'),
        meta: {
          requireAdmin: true
        }
      },
      {
        name: 'Editar Item',
        path: 'inventario/form/:id',
        component: () => import('@/views/dashboard/pages/InventarioForm')
      },
      {
        name: 'Pagos',
        path: 'pagos',
        component: () => import('@/views/dashboard/tables/Pagos'),
        meta: {
          requireAdmin: true
        }
      },
      {
        name: 'Pagos Form',
        path: 'pagos/form/:id',
        component: () => import('@/views/dashboard/pages/PagosForm'),
        meta: {
          requireAdmin: true
        }
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/Login'),
    meta: {
      notRequiresAuth: true
    }
  }
]

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(authGuard)

export default router
