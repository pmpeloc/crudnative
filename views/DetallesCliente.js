import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Headline, Text, Subheading, Button, FAB } from 'react-native-paper';
import globalStyles from '../styles/global';
import axios from 'axios';

const DetallesCliente = ({navigation, route}) => {

    const { guardarConsultarAPI } = route.params;
    const { nombre, telefono, correo, empresa, id } = route.params.item;
    
    const mostrarConfirmacion = () => {
        Alert.alert(
            '¿Desea eliminar este cliente?',
            'Un contacto eliminado no se puede recuperar',
            [
                { text: 'Si, eliminar', onPress: () => eliminarContacto() },
                { text: 'Cancelar', style: 'cancel' }
            ]
        )
    };

    const eliminarContacto = async () => {
        const url = Platform.OS === 'android' ? `http://10.0.2.2:3000/clientes/${id}` : `http://localhost:3000/clientes/${id}`;        
        try {
            await axios.delete(url);
        } catch (error) {
            console.log(error);
        }
        // redireccionar
        navigation.navigate('Inicio');
        // volver a consultar la API
        guardarConsultarAPI(true);
    };

    return (
        <View style={globalStyles.contenedor}>
            <Headline style={globalStyles.titulo}>{nombre}</Headline>
            <Text style={styles.texto}>Empresa: <Subheading>{empresa}</Subheading></Text>
            <Text style={styles.texto}>Teléfono: <Subheading>{telefono}</Subheading></Text>
            <Text style={styles.texto}>Correo: <Subheading>{correo}</Subheading></Text>
            <Button 
                mode="contained" 
                icon="cancel" 
                style={styles.boton}
                onPress={() => mostrarConfirmacion()}
            >
                Eliminar Cliente
            </Button>
            <FAB
                icon="pencil"
                style={globalStyles.fab}
                onPress={() => navigation.navigate('NuevoCliente', {cliente: route.params.item, guardarConsultarAPI})}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    texto: {
        marginBottom: 20,
        fontSize: 18
    },
    boton: {
        marginTop: 100,
        backgroundColor: 'red'
    }
});
 
export default DetallesCliente;