import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";
import AlertDialog from '../../components/Dialog';
import ModalEdit from './ModalEdit';


export default function PostEdit({ post }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  // console.log(post);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  const postId = post._id;
  const userId = post.author._id;
  const dispatch = useDispatch();
  
  const handleDeletePost = (postId) => {
    dispatch(deletePost({postId, userId}))
  };

  return (
      <>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MoreVertIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    aria-labelledby="composition-button"
                  >
                    <ModalEdit post={post} />
                    <AlertDialog 
                      name='Delete'
                      title='Bạn muốn xóa bài post?'
                      content=''
                      agreeFun={() => handleDeletePost(postId)}/>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
  );
}