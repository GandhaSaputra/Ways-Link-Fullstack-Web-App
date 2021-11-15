import { useContext, useEffect } from 'react';
import {Switch, Route} from 'react-router-dom';
import { useHistory } from 'react-router';
import { UserContext } from './config/UserContext';
import LandingPage from './pages/LandingPage';
import TemplatePage from './pages/TemplatePage';
import MyLink from './pages/MyLink';
import ProfilePage from './pages/ProfilePage';
import DetailTemplatePage from './pages/DetailTemplatePage';
import LinkContent from './pages/LinkContent';
import NotFound from './pages/NotFound';
import EditDetailTemplatePage from './pages/EditDetailTemplatePage';
import UnderConstruction from './pages/UnderConstruction';


import {API, setAuthToken} from './config/API'


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {

  let history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      history.push("/");
    } else {
      history.push("/template")
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }
      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, [])

  return (
    <Switch>
      <Route exact path="/" component={LandingPage}/>
      <Route exact path="/template" component={TemplatePage}/>
      <Route exact path="/my-link" component={MyLink}/>
      <Route exact path="/profile" component={ProfilePage}/>
      <Route exact path="/link-content/:uniqueLink" component={LinkContent}/>
      <Route exact path="/detail-template/:id" component={DetailTemplatePage}/>
      <Route exact path="/detail-brand/:uniqueLink" component={EditDetailTemplatePage}/>
      <Route exact path="/under-construction" component={UnderConstruction}/>
      <Route exact path="*" component={NotFound}/>
    </Switch>
  );
}

export default App;
