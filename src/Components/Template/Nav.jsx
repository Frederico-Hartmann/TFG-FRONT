import './Nav.css'
import React from 'react'
import {logout} from '../../Services/auth'
import { faCalendar, faAddressBook, faIdBadge, faQuestion, faSignOutAlt, faMedkit, faBook, faClipboardList, faTeeth, faTooth } from '@fortawesome/free-solid-svg-icons'

import NavItem from './NavItem'

export default props => 
    <aside className = "menu-area">
        <nav className="menu">
            <NavItem icon={faCalendar} title="Agenda" refer="/Agenda"/>
            <NavItem icon={faAddressBook} title="Clientes" refer="/Clientes"/>
            <NavItem icon={faQuestion} title="Perguntas da Anamnese" refer="/PerguntasAnamnese"/>
            <NavItem icon={faTeeth} title="Tratamentos" refer="/Tratamentos"/>
            <NavItem icon={faTooth} title="Procedimentos" refer="/Procedimentos"/>
            <NavItem icon={faClipboardList} title="Receitas" refer="/Receitas"/>
            <NavItem icon={faMedkit} title="Medicamentos" refer="/Medicamentos"/>
            <NavItem icon={faIdBadge} title="Dentistas" refer="/Dentistas"/>
            <NavItem icon={faBook} title="Relatórios" refer="/Relatorios"/>
            <NavItem icon={faSignOutAlt} title="Sair" refer="/" onClick={logout}/>
            <div/>
        </nav>
    </aside>