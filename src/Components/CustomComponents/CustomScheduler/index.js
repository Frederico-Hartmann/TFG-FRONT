import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { Scheduler, WeekView, Appointments, Toolbar, DateNavigator, AppointmentTooltip, TodayButton, Resources } from '@devexpress/dx-react-scheduler-material-ui';

export default function CustomScheduler(props) {
    const useStyles = makeStyles(theme => ({
        todayCell: {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.14),
            },
            '&:focus': {
                backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
        },
        weekendCell: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            '&:hover': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.08),
            },
            '&:focus': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            },
        },
        today: {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
        weekend: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
        },
    }));

    const [visible, setVisible] = useState(false);

    const TimeTableCell = (propsC) => {
        const classes = useStyles();
        const { startDate } = propsC;
        const date = new Date(startDate);

        if (date.getDate() === new Date().getDate()) {
            return <WeekView.TimeTableCell {...propsC} className={classes.todayCell} onClick={() => props.addAction(3)}/>;
        } if (date.getDay() === 0 || date.getDay() === 6) {
            return <WeekView.TimeTableCell {...propsC} className={classes.weekendCell} onClick={() => props.addAction(3)}/>;
        } return <WeekView.TimeTableCell {...propsC} onClick={() => props.addAction(3)}/>;
    };

    const DayScaleCell = (propsC) => {
        const classes = useStyles();
        const { startDate, today } = propsC;

        if (today) {
            return <WeekView.DayScaleCell {...propsC} className={classes.today} />;
        } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            return <WeekView.DayScaleCell {...propsC} className={classes.weekend} />;
        } return <WeekView.DayScaleCell {...propsC} />;
    };

    const style = ({ palette }) => ({
        icon: {
            color: palette.action.active,
        },
        textCenter: {
            textAlign: 'center',
        },
    });

    const Appointment = withStyles(style, { name: 'Header' })(({ children, style, data, ...restProps }) => (
        <Appointments.Appointment
          {...restProps}
          data={data}
          style={{
            ...style,
            backgroundColor: data.color
          }}
        >
          {children}
        </Appointments.Appointment>
      ));

    const Header = withStyles(style, { name: 'Header' })(({ children, appointmentData, classes, ...restProps }) => (
        <AppointmentTooltip.Header
            {...restProps}
            appointmentData={appointmentData}
        >
            <IconButton
                onClick={() => props.editAction(appointmentData.id, appointmentData.tipo, appointmentData.idcliente)}
            >
                <EditIcon />
            </IconButton>
            <IconButton
                onClick={() => props.deleteAction(appointmentData.id)}
            >
                <DeleteIcon />
            </IconButton>
        </AppointmentTooltip.Header>
    ));

    const Content = withStyles(style, { name: 'Content' })(({ children, appointmentData, classes, ...restProps }) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
            {
                (appointmentData.tipo == 1) &&
                <>
                    <Grid container rowSpacing={1} alignItems="center" >
                        <Grid item xs={2} className={classes.textCenter}>
                            <AccountCircleIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs={10} >
                            <span>{appointmentData.nome}</span>
                        </Grid>
                        <Grid item xs={2} className={classes.textCenter} >
                            <MonetizationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs={10}>
                            <span>{(appointmentData.status == 2) ? 'Pago':'Não Pago'}</span>
                        </Grid>
                    </Grid>
                </>
            }
        </AppointmentTooltip.Content>
    ));

    const formatAppointment = (item) => {
        item['title'] = (item.tipo == 2) ? item.descricao : item.nome;
        item['startDate'] = new Date(item.inicio);
        item['endDate'] = new Date(item.fim);
        item['color'] = (item.tipo == 2) ? '#607d8b' : '#00bcd4';
        return item;
    }

    return (
        <Paper>
            <Scheduler data={props.data.map(formatAppointment)} locale='pt-BR'>
                <ViewState currentDate={props.date} onCurrentDateChange={props.setDate} />
                <WeekView
                    startDayHour={7}
                    endDayHour={20}
                    timeTableCellComponent={TimeTableCell}
                    dayScaleCellComponent={DayScaleCell}
                />
                <Toolbar />
                <DateNavigator />
                <Appointments appointmentComponent={Appointment}/>
                <AppointmentTooltip showEvent="dxhoverstart" hideEvent="dxhoverend" headerComponent={Header} contentComponent={Content} showCloseButton/>
            </Scheduler>
        </Paper>
    )
}