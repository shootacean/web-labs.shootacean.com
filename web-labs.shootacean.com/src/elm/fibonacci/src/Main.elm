module Main exposing (..)

import Html exposing (Html, main_, a, button, text, div, ul, li)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Browser
import List.Extra as List

type alias Model
    = { num : Int
      , sequences : List Int
      }

type Msg
    = Increment

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }

init : () -> (Model, Cmd Msg)
init _ =
  ( { num = 10
    , sequences = [0,1,1,2,3,5,8,13,21,34,55]
    }
  , Cmd.none
  )


-- Update

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        Increment ->
            let
                n = model.num + 1
                fib = fibonacci n model.sequences
            in
                ( { model | num = n, sequences = List.append model.sequences [fib] }
                , Cmd.none
                )


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none


-- View

view : Model -> Html Msg
view model =
    div []
        [ viewHeader model
        , viewMain model
        ]

viewHeader : Model -> Html Msg
viewHeader model =
    div []
        [ div []
              [ a [] [ text <| String.fromInt <| model.num ]
              , a [] [ button [ onClick Increment ] [ text "+" ] ]
              ]
        ]

viewMain : Model -> Html Msg
viewMain model =
    main_ []
          [ viewFibonacciSequence model
          ]

viewFibonacciSequence : Model -> Html Msg
viewFibonacciSequence model =
    ul [ class "flex" ]
       (List.map viewNumber model.sequences)

viewNumber : Int -> Html Msg
viewNumber n =
    li [] [ text <| String.fromInt n ]


-- Helpers

fibonacci : Int -> List Int -> Int
fibonacci n memo =
    let
        m = List.getAt n memo
    in
        case m of
            Just memoNum -> memoNum
            Nothing ->
                case n of
                    0 -> 0
                    1 -> 1
                    _ -> ( fibonacci (n - 2) memo ) + ( fibonacci (n - 1) memo )
