import React, { useCallback } from "react";
import { Box, Card, alpha, Stack, MenuItem } from "@mui/material";

import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useForm } from "react-hook-form";

import { editPost } from "./postSlice";
import { LoadingButton } from "@mui/lab";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalEdit({ post }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isLoading } = useSelector((state) => state.post);

  const yupSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

  const defaultValues = {
    content: post.content,
    image: post.image || null,
  };

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = (data) => {
    const postId = post._id;
    // console.log(data, postId);
    handleClose();
    dispatch(editPost(data, postId)).then(() => reset());
  };

  return (
    <div>
      <MenuItem onClick={handleOpen}>Edit</MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card sx={{ p: 3 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FTextField
                  name="content"
                  multiline
                  fullWidth
                  rows={4}
                  placeholder="Share what you are thinking here..."
                  sx={{
                    "& fieldset": {
                      borderWidth: `1px !important`,
                      borderColor: alpha("#919EAB", 0.32),
                    },
                  }}
                />

                <FUploadImage
                  name="image"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    loading={isSubmitting || isLoading}
                  >
                    Edit
                  </LoadingButton>
                  <MenuItem onClick={handleClose}>Hủy</MenuItem>
                </Box>
              </Stack>
            </FormProvider>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}
