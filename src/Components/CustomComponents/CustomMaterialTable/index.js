import './styles.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';
import tableIcons from '../TableIcons';

import { AddBox, Edit, Delete } from '@mui/icons-material';

export default function CustomMaterialTable(props) {
  const history = useHistory();

  return (
    <div>
      <MaterialTable
        title={props.titulo}
        columns={props.colunas}
        data={props.data}
        icons={tableIcons}
        actions={[
          {
            icon: AddBox,
            tooltip: props.add.tooltip,
            onClick: (event, rowData) => {
              props.add.acao()
            },
            isFreeAction: true,
          },
          {
            icon: Edit,
            tooltip: props.editar.tooltip,
            onClick: (event, rowData) => {
              props.editar.acao()
              props.editar.setId(rowData.id)
            }
          },
          {
            icon: Delete,
            tooltip: props.excluir.tooltip,
            onClick: (event, rowData) => {
              props.excluir.acao(rowData.id)
            },
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          draggable: false,
          maxBodyHeight: 600,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30],
          headerStyle: {
            backgroundColor: '#7EC0EE',
            color: '#FFF',
          },
          actionsCellStyle: {
            display: 'flex',
            justifyContent: 'center',
            padding: '3px',
            width: '100%',
            marginBottom: '-1px',
          },
        }}
        localization={{
          toolbar: {
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
          },
          header: {
            actions: 'Ações'
          },
          body: {
            emptyDataSourceMessage: props.msgSemDados
          },
          pagination: {
            labelRowsSelect: 'Registros',
            labelDisplayedRows: '{count} de {from}-{to}',
            firstAriaLabel: 'Primeira Página',
            firstTooltip: 'Primeira Página',
            previousAriaLabel: 'Página Anterior',
            previousTooltip: 'Página Anterior',
            nextAriaLabel: 'Próxima página',
            nextTooltip: 'Próxima página',
            lastAriaLabel: 'Última Página',
            lastTooltip: 'Última Página',
          },
        }}
      />
    </div>
  );
}