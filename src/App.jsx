import Signup from "./pages/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { AlertProvider } from "./contexts/AlertContext";

function App() {
  return (
    <div className="h-screen" data-theme="fantasy">
      <Router>
        <AlertProvider>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute
                exact
                path="/folder/:folderId"
                component={Dashboard}
              />
              <Route path="/home" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </AlertProvider>
      </Router>
    </div>
  );
}

export default App;
