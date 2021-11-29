import React, { Component } from "react"
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { isAuthenticated } from "../Services/auth"

import Login from "../Pages/Login/index"
import Agenda from "../Pages/Admin/Agendamentos/index"
import Clientes from "../Pages/Admin/Clientes/index"
import Perguntas from "../Pages/Admin/PerguntasAnamnese/index"
import Procedimentos from "../Pages/Admin/Procedimentos/index"
import Tratamentos from "../Pages/Admin/Tratamentos/index"
import Receitas from "../Pages/Admin/Receitas/index"
import Medicamentos from "../Pages/Admin/Medicamentos/index"
import Dentistas from "../Pages/Admin/Dentistas/index"
import Relatorios from "../Pages/Admin/Relatorios"

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render = {props=>(
        isAuthenticated() ? (<Component {...props}/>) : (<Redirect to={{pathname:'/', state:{from:props.location}}} />)
    )}/>
)

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login}/> 
                <PrivateRoute exact path='/Agenda' component={Agenda} />
                <PrivateRoute exact path='/Dentistas' component={Dentistas} />
                <PrivateRoute exact path='/Clientes' component={Clientes} />
                <PrivateRoute exact path='/PerguntasAnamnese' component={Perguntas} />
                <PrivateRoute exact path='/Tratamentos' component={Tratamentos} />
                <PrivateRoute exact path='/Procedimentos' component={Procedimentos} />
                <PrivateRoute exact path='/Receitas' component={Receitas} />
                <PrivateRoute exact path='/Medicamentos' component={Medicamentos} />
                <PrivateRoute exact path='/Dentistas' component={Dentistas} />
                <PrivateRoute exact path='/Relatorios' component={Relatorios} />
                <Redirect from='*' to='/' />
            </Switch>
        </BrowserRouter>
    )
}
