import React from 'react'
import ReactDom from 'react-dom'

let reactNode = React.createElement('h1',null,'我很大')
ReactDom.render(reactNode,document.getElementById('app'))