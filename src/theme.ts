import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    colors: {
        primary: "linear-gradient(117.45deg, #7600D3 34.42%, rgba(0, 102, 222, 0.97) 89.39%)",
        brand: {
            "50": "#F3EAFA",
            "100": "#DEC6F1",
            "200": "#C9A1E8",
            "300": "#B47CDF",
            "400": "#9E57D6",
            "500": "#8932CD",
            "600": "#6E28A4",
            "700": "#521E7B",
            "800": "#371452",
            "900": "#1B0A29",
        },
    },
    fonts: {
        body: "IBM Plex Sans, sans-serif",
        heading: "IBM Plex Sans, sans-serif",
    },
    components: {
        Button: {
            variants: {
                solid: {
                    bg: "brand.500",
                    borderRadius: "10px",
                    _hover: {
                        bg: "brand.400",
                    },
                },
            },
        },
    },
})

export default theme
