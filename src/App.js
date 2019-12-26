import React from "react";
import "./App.css";
import Routes from "./routes";
import apolloClient from "./services/apollo";
import { ApolloProvider } from "@apollo/react-hooks";


function App() {
 
  return (
    <ApolloProvider client={apolloClient}>
      <Routes/>
    </ApolloProvider>
  );
}

export default App;
