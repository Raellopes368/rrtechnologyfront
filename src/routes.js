import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Conversa from "./pages/Conversa";
import apolloClient from "./services/apollo";
import { ApolloProvider } from "@apollo/react-hooks";
import Add from "./pages/Add"

export default function Routes() {
  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
      </ApolloProvider>
      <Route path="/" exact component={Login} />
      <Route path="/home/:id" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/conversa/:id/:idUser/:idCntt" render={(props) => <Conversa {...props} />} />
      <Route path="/add/:id" component={Add} />
    </BrowserRouter>
  );
}

