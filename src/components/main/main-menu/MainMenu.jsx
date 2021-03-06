import * as Debug from 'debug';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { demoUser } from 'config';
import { ErrorBoundary, deleteUser, logout } from 'utilities';
import { ConfirmDialog } from 'components';

/*
  ! Fix fade animation for 'Delete Account dialog'
*/

const debug = Debug('src:components:main-menu');

const S = {};

S.IconButton = styled(IconButton)`
  padding: 11px 5px 11px 5px;
`;

S.MoreVertIcon = styled(MoreVertIcon)`
  color: ${props => props.theme.lightColor}
`;

const MainMenu = (props) => {
  debug('[MainMenu] rendered');

  const { revokeAuth, username } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [dialogShouldRender, setDialogShouldRender] = useState(false);
  const [menuShouldRender, setMenuShouldRender] = useState(false);
  const [menuShouldOpen, setMenuShouldOpen] = useState(false);

  useEffect(() => {
    if (username === demoUser) {
      setDisabled(true);
    }
  }, [username]);

  useEffect(() => {
    debug(`selected: ${selected}`);

    if (selected === 'delete') {
      setDialogShouldRender(val => !val);
    }

    if (selected === 'logout') {
      logout().then(() => revokeAuth());
    }

    return () => {
      setMenuShouldOpen(false);
      setAnchorEl(null);
      setSelected('');
    };
  }, [selected, revokeAuth]);

  const handleMenuButtonClick = (event) => {
    debug(`
      event: ${event.currentTarget}
      menuShouldRender: ${menuShouldRender}
    `);
    setAnchorEl(event.currentTarget);
    setMenuShouldRender(true);
    setMenuShouldOpen(true);
  };

  const confirmDialog = (isConfirmed) => {
    setDialogShouldRender(false);
    if (isConfirmed) {
      deleteUser(username);
    }
  };

  return (
    <>
      {dialogShouldRender
        && (
          <ConfirmDialog
            confirmDialog={confirmDialog}
            open={dialogShouldRender}
            variant='deleteAccount'
          />
        )
      }
      <S.IconButton
        aria-label='More'
        aria-owns={menuShouldRender ? 'main-menu' : undefined}
        aria-haspopup='true'
        className='s-icon-button'
        onClick={handleMenuButtonClick}
      >
        <S.MoreVertIcon />
      </S.IconButton>
      {menuShouldRender
        && (
          <Paper>
            <Menu
              id='main-menu'
              anchorEl={anchorEl}
              open={menuShouldOpen}
              onClose={() => setSelected('exitActionSelected')}
              onExited={() => setMenuShouldRender(false)}
            >
              <ErrorBoundary>
                <MenuItem data-value='delete' dense disabled={isDisabled} onClick={() => setSelected('delete')}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary='Delete Account' />
                </MenuItem>
              </ErrorBoundary>
              <ErrorBoundary>
                <MenuItem data-value='logout' dense onClick={() => setSelected('logout')}>
                  <ListItemIcon>
                    <MeetingRoomIcon />
                  </ListItemIcon>
                  <ListItemText primary='Logout' />
                </MenuItem>
              </ErrorBoundary>
              <ErrorBoundary>
                <MenuItem data-value='close' dense onClick={() => setSelected('noSelection')}>
                  <ListItemIcon>
                    <CloseIcon />
                  </ListItemIcon>
                  <ListItemText primary='Close Menu' />
                </MenuItem>
              </ErrorBoundary>
            </Menu>
          </Paper>
      )}
    </>
  );
};

MainMenu.propTypes = {
  revokeAuth: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default React.memo(MainMenu);
