module Main exposing (..)

import Html exposing (Html, nav, ul, li, a, text)
import Html.Attributes exposing (href)

main =
    nav []
        [ ul []
             [ li [] [ a [ href "fibonacci/index.html" ] [ text "Fibonacci" ] ]
             ]
        ]
