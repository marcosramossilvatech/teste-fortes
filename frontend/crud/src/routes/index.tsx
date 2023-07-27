import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {  useDrawerContext } from "../shared/context";
import { Dashboard, DetalheDeFornecedores, DetalheDeProdutos, ListagemDeFornecedores, ListagemDeProduto } from "../pages";


export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Dashboard',
      },
      {
        icon: 'address',
        path: '/produtos',
        label: 'Produtos',
      },
      {
        icon: 'group',
        path: '/fornecedores',
        label: 'Fornecedores',
      },
      {
        icon: 'shoplist',
        path: '/pedidos',
        label: 'Pedidos',
      }
    ]);
  }, []);
  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard/>} />
      <Route path="/produtos" element={<ListagemDeProduto/>} />  
      <Route path="/produtos/detalhe/:codigo" element={<DetalheDeProdutos/>} />  
      <Route path="/fornecedores" element={<ListagemDeFornecedores/>} /> 
      <Route path="/fornecedores/detalhe/:cnpj" element={<DetalheDeFornecedores/>} /> 
      <Route path="/pedidos" element={<p>Pedidos</p>} /> 
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
