import Vue from 'vue'
import Router from 'vue-router'

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
        name: 'Productos',
        path: 'productos',
        component: () => import('@/views/dashboard/tables/Productos')
      },
      {
        name: 'Productos Form',
        path: 'productos/form',
        component: () => import('@/views/dashboard/tables/ProductForm'),
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
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
