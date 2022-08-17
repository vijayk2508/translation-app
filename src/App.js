/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */

import React, { useState } from 'react'
import axios from 'axios'
function App() {
  const [input, setInput] = useState([ ])
  const [output, setOutput] = useState('')

  const fetchApi = async (url, params, myResolve, myReject) => {
    try {
      const response = await axios.post(url, null, { params })
      return myResolve(response.data)
    } catch (e) {
      console.log('res', e)
      return myReject(e)
    }
  }
  const LangList = [
    'ar',
    'zh-CN',
    'tl',
    'fr',
    'de',
    'hi',
    'it',
    'ml',
    'ru',
    'es',
    'ur',
  ]
  const node = true
  const nodeLocal = false
  let translationConfig = {
    translateUrl: `https://inplass.herokuapp.com/gameContest/getTranslatedData`,
    params: {
      from: 'en',
      to: 'ar',
      text: 'hi',
    },
  }

  const onClick = async e => {
    e.preventDefault()
    let { translateUrl, params } = translationConfig
    let parseText = ''
    let translateData = {}
    try {
      parseText = JSON.parse(textArray)
    } catch (err) {
      parseText = textArray
    }

    if (typeof parseText === 'string') {
      //
    } else {
      if (Array.isArray(parseText)) {
        if (parseText) {
          parseText.map(text => {
            LangList.map(toLang => {
              if (!translateData[text]) {
                new Promise(function (myResolve, myReject) {
                  let data = fetchApi(
                    translateUrl,
                    {
                      ...params,
                      to: toLang,
                      text: text,
                    },
                    myResolve,
                    myReject
                  )
                  console.log(data)
                })
                  .then(
                    function (res) {
                      translateData[text] = {
                        ...translateData[text],
                        [toLang]: {
                          [text]: !node
                            ? res?.data?.translations[0]?.translatedText
                            : res.data.text,
                        },
                      }
                      return translateData
                    },
                    function (error) {
                      console.log(error)
                    }
                  )
                  .then(res => {
                    console.log(res, translateData)
                    let json = {
                      ar: {},
                      'zh-CN': {},
                      en: {},
                      tl: {},
                      fr: {},
                      de: {},
                      hi: {},
                      it: {},
                      ml: {},
                      ru: {},
                      es: {},
                      ur: {},
                    }

                    Object.values(translateData).map(item => {
                      let getObjLang = Object.keys(item)
                      getObjLang.map(lan => {
                        json[lan] = { ...json[lan], ...item[lan] }
                      })
                    })

                    setOutput(json)
                  })
              }
            })
          })
        }
      }
    }
  }

  const [text, setText] = useState('')
  const [textArray, setTextArray] = useState([])
  const [file, setFile] = useState(null)
  return (
    <div className="App">
      <>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        ></input>
        <input
          type="button"
          value="Add"
          onClick={e => {
            e.preventDefault()
            if (text.trim().length > 0) {
              let idx = textArray.findIndex(item => item.includes(text))
              if (idx < 0) {
                setTextArray([...textArray, text])
                setText('')
              } else {
                alert('Already in our list')
              }
            } else {
              alert('Text is empty')
            }
          }}
        />
      </>
      <ul>
        {textArray.map((item, idx) => (
          <li>
            {item}
            <input
              type="button"
              value="Remove"
              onClick={e => {
                e.preventDefault()
                textArray.splice(idx, 1)
                setTextArray([...textArray])
              }}
            />
          </li>
        ))}
      </ul>
      <textarea value={textArray} onChange={e => setInput(e.target.value)} />
      <input type="button" value="Translate" onClick={onClick} />
      <div
        style={{
          whitespace: 'pre',
          fontFamily: 'monospace',
          background: 'black',
          color: 'white',
          height: '50',
          overflowY: 'auto',
        }}
      >
        <pre
          id="json"
          style={{
            whitespace: 'pre',
            fontFamily: 'monospace',
            background: 'black',
            color: 'white',
            height: '50',
            overflowY: 'auto',
          }}
        >
          {JSON.stringify(output, null, 4)}
        </pre>
      </div>
    </div>
  )
}

export default App
