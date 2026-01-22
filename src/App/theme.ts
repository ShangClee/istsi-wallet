import { createTheme } from "@mui/material/styles"
import Fade from "@mui/material/Fade"
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import amber from "@mui/material/colors/amber"
import lightBlue from "@mui/material/colors/lightBlue"
import grey from "@mui/material/colors/grey"
import { SlideLeftTransition, SlideUpTransition } from "../Generic/components/Transitions"

// MUI v5 uses createTheme instead of createMuiTheme
// breakpoints are now accessed via theme.breakpoints
const createBreakpoints = () => {
  return {
    keys: ["xs", "sm", "md", "lg", "xl"] as const,
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    up: (key: number | "xs" | "sm" | "md" | "lg" | "xl") =>
      `@media (min-width:${typeof key === "number" ? key : { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[key]}px)`,
    down: (key: number | "xs" | "sm" | "md" | "lg" | "xl") =>
      `@media (max-width:${
        typeof key === "number" ? key - 0.05 : { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[key] - 0.05
      }px)`,
    between: (start: "xs" | "sm" | "md" | "lg" | "xl", end: "xs" | "sm" | "md" | "lg" | "xl") => "",
    only: (key: "xs" | "sm" | "md" | "lg" | "xl") => "",
    unit: "px" as const
  }
}

// TODO: The dark and light derivation of the brand color have not been design-reviewed!
export const brandColor = {
  dark: "#0290c0",
  main: "#02b8f5",
  main15: "#02b8f526",
  light: "#72dbfe"
}

export const primaryBackground = "linear-gradient(to left bottom, #01B3F3, #0176DC)"
export const primaryBackgroundColor = "#0194E7"

export const warningColor = amber["500"]

export const breakpoints = createBreakpoints()

export const FullscreenDialogTransition = SlideLeftTransition
export const CompactDialogTransition = SlideUpTransition

const isSmallScreen = window.innerWidth <= 600

const theme = createTheme({
  components: {
    MuiDialogActions: {
      defaultProps: {
        // disableSpacing: true
      }
    },
    MuiInputLabel: {
      defaultProps: {
        required: false,
        shrink: true
      },
      styleOverrides: {
        formControl: {
          [breakpoints.down(600)]: {
            fontSize: "0.85rem"
          },
          [breakpoints.down(400)]: {
            fontSize: "0.75rem"
          }
        }
      }
    },
    MuiMenu: isSmallScreen
      ? {
          defaultProps: {
            BackdropProps: {
              open: true
            } as any,
            TransitionComponent: Fade,
            transitionDuration: 300,
            transformOrigin: {
              horizontal: "center",
              vertical: "center"
            }
          },
          styleOverrides: {
            paper: {
              [breakpoints.down(600)]: {
                backgroundColor: "white",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                bottom: "0 !important",
                left: "0 !important",
                right: "0 !important",
                top: "initial !important",
                maxWidth: "100vw",
                position: "fixed",

                // declaring these here because passing a className into MuiMenu-props does not work as the styles of that class are overridden several times
                "&": {
                  // iOS 11
                  paddingBottom: "constant(safe-area-inset-bottom)"
                },
                // iOS 12
                paddingBottom: "env(safe-area-inset-bottom)"
              }
            },
            list: {
              padding: 0
            }
          }
        }
      : {},
    MuiSelect: {
      defaultProps: {
        IconComponent: ArrowDownIcon
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          minHeight: 48,

          [breakpoints.down(600)]: {
            minHeight: 36
          }
        },
        contained: {
          backgroundColor: "white",
          boxShadow: "none",
          border: `none`,
          color: brandColor.dark,

          "&:hover": {
            backgroundColor: "#F8F8F8"
          },

          [breakpoints.down(600)]: {
            boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.1)"
          }
        },
        containedPrimary: {
          "&.Mui-disabled": {
            backgroundColor: brandColor.main,
            border: "none",
            boxShadow: "none",
            color: "rgba(255, 255, 255, 0.7)"
          },
          "&:hover": {
            backgroundColor: "#02b2f2"
          }
        },
        textPrimary: {
          color: brandColor.dark
        },
        outlinedSecondary: {
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.87)",
          boxShadow: "none",
          color: "white",

          "&:disabled": {
            opacity: 0.5
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.10)",
            borderColor: "white"
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          [breakpoints.down(600)]: {
            padding: 8
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          WebkitOverflowScrolling: "touch"
        },
        paperFullScreen: {
          backgroundColor: "#fcfcfc",
          boxSizing: "border-box"
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          "&.Mui-focused": {
            color: "inherit !important"
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          lineHeight: "27px"
        },
        formControl: {
          "label + &": {
            marginTop: 12
          }
        },
        inputMultiline: {
          lineHeight: "24px"
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 18,
          fontWeight: 300,
          [breakpoints.down(400)]: {
            fontSize: 16
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: lightBlue["100"]
        },
        barColorPrimary: {
          backgroundColor: lightBlue.A200
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingLeft: 8,
          paddingRight: 8,
          [breakpoints.down(600)]: {
            paddingLeft: 0,
            paddingRight: 0
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0,0,0,0.04)",

          [breakpoints.down(600)]: {
            paddingLeft: 8,
            paddingRight: 8
          },
          "& + hr": {
            borderBottom: "none"
          }
        },
        button: {
          background: "#FFFFFF",
          boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.1)",

          "&:focus:not(.Mui-selected)": {
            backgroundColor: "#FFFFFF"
          },
          "&:hover": {
            backgroundColor: "#F8F8F8",

            [breakpoints.down(600)]: {
              backgroundColor: "#FFFFFF"
            }
          },
          "&:first-child": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          },
          "&:last-child": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          display: "block"
        }
      }
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          [breakpoints.down(600)]: {
            paddingLeft: 8,
            paddingRight: 8
          }
        },
        sticky: {
          background: "linear-gradient(to bottom, white 0%, white 70%, rgba(255, 255, 255, 0) 100%)"
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderBottom: "none",
          [breakpoints.down(600)]: {
            fontSize: 20,
            padding: 16
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        colorSecondary: {
          color: grey[50],
          "&.Mui-checked": {
            color: grey[50]
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: grey[50]
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.2s",
          "&.Mui-selected": {
            backgroundColor: brandColor.main,
            color: "white",
            "&:hover": {
              // Don't change color of already-selected tab
              backgroundColor: brandColor.main
            }
          },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.15)"
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "rgba(255, 255, 255, 0)"
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 400
        }
      }
    }
  },
  palette: {
    primary: {
      contrastText: "white",
      dark: brandColor.dark,
      main: brandColor.main,
      light: brandColor.light
    }
  },
  shape: {
    borderRadius: 8
  }
})

export default theme

const initialScreenHeight = window.screen.height

// CSS media query selector to detect an open keyboard on iOS + Android
export const MobileKeyboardOpenedSelector =
  process.env.PLATFORM === "ios" || process.env.PLATFORM === "android"
    ? () => `@media (max-height: ${initialScreenHeight - 100}px)`
    : () => `:not(*)`
