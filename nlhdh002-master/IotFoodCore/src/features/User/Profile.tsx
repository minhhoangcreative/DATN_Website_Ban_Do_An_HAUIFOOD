import userApi from "@/api/userApi"
import { useAppDispatch } from "@/app/hooks"
import { InputField } from "@/components/FormControls"
import { useInforUser } from "@/hooks"
import { UserInfo } from "@/models"
import { InfoForm } from "@/models/InfoForm"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  TextField,
} from "@mui/material"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { useSnackbar } from "notistack"
import * as React from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { authActions } from "../auth/AuthSlice"

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const user = useInforUser()
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = React.useState<File | null>(null)
  const imgRef = React.useRef<HTMLInputElement | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>("")
  const [otpValue, setOptValue] = React.useState<string>("")
  const [pw, setPw] = React.useState<string>("")
  const [openPw, setOpenPw] = React.useState<boolean>(false)
  const [userInfo, setUserInfo] = React.useState<UserInfo>()
  const [checkUpdateUser, setCheckUpdateUser] = React.useState<string[]>(["a"])
  const [payload, setPayload] = React.useState({
    name: "",
    sdt: "",
  })
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const schema = yup.object().shape({
    msv: yup.string().required("Vui lòng nhập khách hàng của bạn !"),
    email: yup.string().notRequired().email("Vui lòng nhập đúng định dạng !"),
    accountName: yup
      .string()
      .required("Hãy nhập tên đầy đủ của bạn")
      .test(
        "Họ và tên nên gồm 2 từ trở lên",
        "Họ và tên gồm 2 từ trở lên chỉ bao gồm chữ cái",
        (value) => {
          const words = value.trim().split(" ")
          return (
            words.length >= 2 &&
            words.every(
              (word) => !/\d[@#$%^&*()_+{}\[\]:;<>,.?~\\|/]/.test(word),
            )
          )
        },
      ),
    sdt: yup
      .string()
      .required("Điền số điện thoại")
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .min(9, "Quá ngắn")
      .max(11, "Quá dài"),
  })
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files && event.target.files[0]
    if (selectedImage && event.target.files) {
      setFile(event.target.files[0])
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedImage)
    }
  }
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const handleSendOtp = async (email: string) => {
    try {
      setLoading(true)
      const response = await userApi.verifyEmail(email)
      if (response.status) {
        setOpen(true)
        setLoading(false)
      } else {
        setLoading(false)
        enqueueSnackbar("Tài khoản của bạn đã được xác thực trước đó !", {
          variant: "error",
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleConfirmUpdate = () => {
    setOpenPw(false)
    if (file !== null) handleChangeInfo(payload.name, payload.sdt, file)
    else handleChangeInfo(payload.name, payload.sdt, null)
  }
  const handleSubmit: SubmitHandler<InfoForm> = (data) => {
    if (data.email?.length && data.email !== user?.email) {
      handleSendOtp(data.email)
    }
    if (
      data.accountName !== user?.accountName ||
      data.sdt !== user?.sdt ||
      file !== null
    ) {
      setOpenPw(true)
      setPayload({ name: data.accountName, sdt: data.sdt })
    }
  }
  const dispatch = useAppDispatch()
  const confirmOtp = async (otp: string) => {
    try {
      setLoading(true)
      const response = await userApi.validate(otp)
      setLoading(false)
      enqueueSnackbar("Xác thực gmail thành công !", {
        variant: "success",
      })
      const resInfor = await userApi.getUserInfo()
      dispatch(authActions.updateInfor(resInfor.data))
      setOpen(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      enqueueSnackbar("Xác thực gmail thất bại !", {
        variant: "error",
      })
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClosePw = () => {
    setOpenPw(false)
  }

  const handleConfirm = () => {
    confirmOtp(otpValue)
  }

  const handleChangeInfo = async (
    accountName: string,
    sdt: string,
    file: File | null,
  ) => {
    try {
      setLoading(true)
      const response = await userApi.updateUserInformation({
        password: pw,
        newPassword: null,
        accountName,
        img: file,
        sdt,
      })
      const resInfor = await userApi.getUserInfo()
      dispatch(authActions.updateInfor(resInfor.data))
      enqueueSnackbar("Thay đổi thành công !", {
        variant: "success",
      })

      setLoading(false)
    } catch (err) {
      setLoading(false)
      enqueueSnackbar("Mật khẩu không chính xác", {
        variant: "error",
      })
      console.log(err)
    }
  }
  const form = useForm<InfoForm>({
    defaultValues: {
      accountName: userInfo?.accountName || user?.accountName,
      sdt: userInfo?.sdt || user?.sdt,
      msv: userInfo?.username || user?.msv,
      email: userInfo?.email || user?.email || undefined,
    },
    resolver: yupResolver(schema),
  })

  React.useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await userApi.getUserInfo()
        if (response.status) {
          setUserInfo(response.data)
          setImagePreview(response.data.img || user?.imgUser || "")
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchDataUser()
  }, [checkUpdateUser])

  return (
    <div className="relative w-full">
      <div className="mb-5">
        <h1 className="text-18-500">Hồ Sơ Của Tôi</h1>
        <p className="text-[#999798]">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>
      <Divider />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex mt-5">
        <Container className="!pl-0">
          <FormProvider {...form}>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputField label="Tên của bạn" name="accountName" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField label="Mã khách hàng" name="msv" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField label="Số điện thoại" name="sdt" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="Email"
                    name="email"
                    disabled={user?.email?.length ? true : false}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
              >
                Lưu
              </Button>
            </form>
          </FormProvider>
        </Container>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Box className="flex items-center justify-center flex-col w-[250px]">
          <input
            ref={imgRef}
            hidden={true}
            type="file"
            id="imageInput"
            onChange={handleImageChange}
            name="imageInput"
            accept="image/png, image/jpeg"
          ></input>
          <Avatar
            variant="circular"
            alt="avatar"
            sx={{ width: "100px", height: "100px", mr: 1, mb: 3 }}
            src={imagePreview}
            onClick={() => {
              imgRef.current?.click()
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              imgRef.current?.click()
            }}
          >
            Chọn ảnh
          </Button>
        </Box>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vui lòng kiểm tra gmail để lấy mã OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="OTP"
            type="email"
            fullWidth
            variant="standard"
            style={{ width: "20vw" }}
            value={otpValue}
            onChange={(e) => setOptValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleConfirm}>Xác Nhận</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPw} onClose={handleClosePw}>
        <DialogTitle>Vui lòng nhập mật khẩu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="text"
            fullWidth
            variant="standard"
            style={{ width: "20vw" }}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePw}>Hủy</Button>
          <Button onClick={handleConfirmUpdate}>Xác Nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
