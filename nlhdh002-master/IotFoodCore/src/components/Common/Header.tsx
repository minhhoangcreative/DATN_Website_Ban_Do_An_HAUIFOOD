import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useInforUser, useScroll } from "@/hooks"
import { handlePrice } from "@/utils"
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material"
import useDetectScroll from "@smakss/react-scroll-direction"
import classNames from "classnames"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { CartDrawer } from "."
import { CustomButton } from "../Custom/CustomButon"
import { BagBoldIcon, BagIcon, NotiIcon } from "../Icon"
import { cartActions } from "./CartDrawer/CartSlice"
import { MenuUser } from "./MenuUser"
import "./styles_common.css"
export interface HeaderProps {
  sx?: { [index: string]: string }
  className?: string
  isWhiteLogo?: boolean
  theme?:string
  noItem?:boolean
}

export function Header(props: HeaderProps) {
  const { sx, className, isWhiteLogo = true,theme="default",noItem=false } = props
  const user = useInforUser()
  const dispatch = useAppDispatch()
  const scrollY = useScroll()
  const totalPrice = useAppSelector((state) => state.cart.totalPrice)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { dataStore, lengthFood } = useAppSelector((state) => state.cart)
  const handleClick = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const cartRef = useRef<HTMLDivElement>(null)
  const scrollDir = useDetectScroll({})
  useEffect(() => {
    if (scrollDir === "up" && cartRef.current) {
      cartRef.current.style.transform = "translate(-50%,0px)"
    }
    if (scrollDir == "down" && cartRef.current) {
      cartRef.current.style.transform = "translate(-50%,80px)"
    }
  }, [scrollDir])
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { width } = useAppSelector(state=>state.app)
  const setterBg =
    scrollY >= 40 || (scrollY >= 50 && width < 500) ? true : false
  const mobile = width <= 750 ? true : false
  const handleOpenCard = () => {
    dispatch(cartActions.toggleCart())
  }

  return (
    <>
      <CartDrawer />
      <Box
        className={classNames(
          "w-screen",
          "flex",
          "items-center",
          "justify-center",
          "ani-bg",
          { [`${className}`]: className },
          { "header-sd": !(setterBg || sx) && !mobile },
          `${
            !isWhiteLogo
              ? setterBg && "header-unset"
              : setterBg && "header-color"
          }`,
        )}
        sx={{
          height: `${width <= 500 ? "60px" : "80px"}`,
          position: "fixed",
          zIndex: 20,
          top: 0,
          ...sx,
        }}
      >
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          className="container-base base-pd"
          sx={{
            position: "fixed",
            top: "0",
            height: "inherit",
          }}
        >
          <Link to="/">
            <img
              src={
                !isWhiteLogo
                  ? "/assets/tlufood_b.png"
                  : (mobile && setterBg) || theme==="red"
                  ? "/assets/tlufood.png"
                  : mobile 
                  ? "/assets/tlufood_b.png"
                  : "/assets/tlufood.png"
              }
              style={{ width: `${width <= 500 ? "100px" : "130px"}` }}
              alt="logo"
            />
          </Link>
          <Stack direction={"row"} alignItems="center" position={"relative"}>
            {!noItem && <>
              {width > 500 ? (
              <Badge
                color="secondary"
                badgeContent={lengthFood}
                max={99}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--color-df-1)",
                  },
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <CustomButton
                  onClick={handleOpenCard}
                  sx={{
                    padding: "10px 12px",
                    mr: 1,
                    minWidth: "unset",
                    display: "flex",
                    gap: "3px",
                    backgroundColor: `${
                      !isWhiteLogo
                        ? "white"
                        : setterBg || lengthFood === 0
                        ? "white"
                        : "var(--color-layer-2)"
                    }`,
                    "&:hover": {
                      backgroundColor: `${
                        !isWhiteLogo
                          ? "white"
                          : setterBg || lengthFood === 0
                          ? "white"
                          : "var(--color-layer-2)"
                      }`,
                      border: "1px solid #c8c8c8",
                    },
                  }}
                >
                  <BagIcon
                    color={`${
                      !isWhiteLogo
                        ? "var(--color-df-1)"
                        : setterBg || dataStore.length === 0
                        ? "var(--color-df-1)"
                        : "white"
                    }`}
                  />
                  {lengthFood > 0 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "16x",
                          fontWeight: "500",
                          transform: "translateY(1px)",
                          color: `${
                            !isWhiteLogo
                              ? "var(--color-df-1)"
                              : setterBg || lengthFood === 0
                              ? "black"
                              : "white"
                          }`,
                        }}
                      >
                        {handlePrice(totalPrice)} ₫
                      </Typography>
                    </>
                  )}
                </CustomButton>
              </Badge>
            ) : (
              <div
                ref={cartRef}
                style={{ transition: "all 0.3s" }}
                className={classNames(
                  "max-w-[400px]",
                  "bottom-[15px]",
                  "fixed",
                  "w-[100vw]",
                  "px-[20px]",
                  {
                    "left-[50%] -translate-x-1/2": lengthFood > 0,
                    "left-[123%]": lengthFood === 0,
                  },
                )}
              >
                {lengthFood > 0 ? (
                  <CustomButton
                    onClick={handleOpenCard}
                    sx={{
                      padding: "10px 20px",
                      width: "100%",
                      minWidth: "unset",
                      borderRadius: "30px",
                      display: "flex",
                      justifyContent: "space-between",
                      border: "none",
                      textTransform: "unset",
                      backgroundColor: "var(--color-layer-2)",
                      "&:hover": {
                        backgroundColor: "var(--color-layer-2)",
                        border: "none",
                      },
                    }}
                  >
                    {lengthFood > 0 && (
                      <Stack
                        direction="column"
                        sx={{ "& > *": { color: "white" } }}
                        alignItems="flex-start"
                      >
                        <span className="font-semibold text-sm">
                          {lengthFood} món
                        </span>
                        <span className="font-light text-sx">
                          HAUI
                        </span>
                      </Stack>
                    )}
                    <Stack direction="row" alignItems="center">
                      {dataStore.length > 0 && (
                        <>
                          <Typography
                            sx={{
                              fontSize: "17px",
                              fontWeight: "600",
                              color: `${
                                dataStore.length === 0 ? "black" : "white"
                              }`,
                              mr: "5px",
                            }}
                          >
                            {handlePrice(totalPrice)} ₫
                          </Typography>
                        </>
                      )}
                      <BagBoldIcon color="white" fontSize="large" />
                    </Stack>
                  </CustomButton>
                ) : (
                  <CustomButton
                    onClick={handleOpenCard}
                    sx={{
                      padding: "13px 15px",
                      mr: 1,
                      minWidth: "unset",
                      display: "flex",
                      gap: "3px",

                      backgroundColor: "var(--color-df-1)",

                      "&:hover": {
                        backgroundColor: "var(--color-df-1)",
                      },
                    }}
                  >
                    <BagIcon color="white" />
                  </CustomButton>
                )}
              </div>
            )}

            </>}
            {user ? (
              <>
                <CustomButton
                  sx={{
                    padding: width <= 500 ? "7px 10px" : "10px 12px",
                    mr: 2,
                    minWidth: "unset",
                  }}
                >
                  <NotiIcon />
                </CustomButton>

                <Avatar
                  sx={{
                    cursor: "pointer",
                    width: width <= 500 ? 35 : 45,
                    height: width <= 500 ? 35 : 45,
                    border: "1px solid #f0efef",
                  }}
                  onClick={handleClick}
                  src={user.imgUser}
                />

                <MenuUser anchorEl={anchorEl} handleClose={handleClose} />
              </>
            ) : (
              <Link to={"/login"}>
                <CustomButton
                  sx={{
                    lineHeight:"1.85",
                    padding: "10px 15px",
                    fontSize: `${width <= 500 ? "10px" : "13px"}`,
                    height: "100%",
                  }}
                >
                  Đăng nhập/Đăng ký
                </CustomButton>
              </Link>
            )}
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
