import React, { useState } from 'react';
import {
  Switch,
  Route,
  Redirect,
  Link as RouterLink,
  useRouteMatch
} from 'react-router-dom';
import {
  useAuth
} from 'reactfire';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import CategoryIcon from '@material-ui/icons/Category';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Anomalies from './Anomalies';
import Types from './Types';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3, 0)
  }
}));

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

function Dashboard() {
  const auth = useAuth();
  const classes = useStyles();
  const { path } = useRouteMatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const clearFirestoreCache = () => {
    /*global globalThis*/
    const map = globalThis['_reactFirePreloadedObservables'];
    Array.from(map.keys()).forEach(
      (key) => key.includes('firestore') && map.delete(key),
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = async () => {
    await auth.signOut();
    clearFirestoreCache()
    handleClose();
  };

  const appBar = (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.title}>
          Rostrenen et moi
        </Typography>

        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={signOut}>Déconnexion</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  const drawerContent = (
    <div>
      <Divider />

      <List>
        <ListItemLink to={`${path}/anomalies`} icon={<ReportProblemIcon />} primary="Anomalies" />
        <ListItemLink to={`${path}/types`} icon={<CategoryIcon />} primary="Types d'anomalies" />
      </List>
    </div>
  );

  const responsiveDrawer = (
    <nav className={classes.drawer}>
      <Hidden smUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>

      <Hidden smDown>
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );

  return (
    <div className={classes.root}>
      {appBar}
      {responsiveDrawer}

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Container maxWidth="lg">
          <Switch>
            <Route path={`${path}/anomalies`}>
              <Anomalies />
            </Route>

            <Route path={`${path}/types`}>
              <Types />
            </Route>

            <Redirect from={path} to={`${path}/anomalies`} />
          </Switch>
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;
