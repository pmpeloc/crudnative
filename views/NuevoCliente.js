import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Headline, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import axios from 'axios';
import globalStyles from '../styles/global';

const NuevoCliente = ({navigation, route}) => {

    const { guardarConsultarAPI } = route.params;

    // campos para el formulario
    const [nombre, guardarNombre] = useState('');
    const [telefono, guardarTelefono] = useState('');
    const [correo, guardarCorreo] = useState('');
    const [empresa, guardarEmpresa] = useState('');
    const [alerta, guardarAlerta] = useState(false);

    // detectar si estoy editando o creando
    useEffect(() => {
        if (route.params.cliente) {
            // editando
            const { nombre, telefono, correo, empresa } = route.params.cliente;
            guardarNombre(nombre);
            guardarTelefono(telefono);
            guardarCorreo(correo);
            guardarEmpresa(empresa);
        }
    }, []);

    // almacena el cliente en la BD
    const guardarCliente = async () => {
        // validar
        if (nombre.trim() === '' || telefono.trim() === '' || correo.trim() === '' || empresa.trim() === '') {
            guardarAlerta(true);
            return;
        }
        // generar el cliente
        const cliente = {nombre, telefono, correo, empresa};
        // si estamos editando o creando un nuevo cliente
        if (route.params.cliente) {
            const { id } = route.params.cliente;
            cliente.id = id;
            const url = Platform.OS === 'android' ? `http://10.0.2.2:3000/clientes/${id}` : `http://localhost:3000/clientes/${id}`;
            try {
                await axios.put(url, cliente);
            } catch (error) {
                console.log(error);
            }
        } else {
            // guardar el cliente en la API
            try {
                if (Platform.OS === 'android') {
                    // para android
                    await axios.post('http://10.0.2.2:3000/clientes', cliente);
                } else {
                    // para ios
                    await axios.post('http://localhost:3000/clientes', cliente);
                }                    
            } catch (error) {
                console.log(error);
            }
        }
        // redireccionar
        navigation.navigate('Inicio');
        // limpiar el form (opcional)
        guardarNombre('');
        guardarTelefono('');
        guardarCorreo('');
        guardarEmpresa('');
        // cambiar a true para traernos el nuevo cliente
        guardarConsultarAPI(true);
    };

    return (
        <ScrollView>
            <View style={globalStyles.contenedor}>
                <Headline style={globalStyles.titulo}>Añadir nuevo cliente</Headline>
                <TextInput
                    label="Nombre"
                    placeholder="Ingresa tu nombre"
                    onChangeText={texto => guardarNombre(texto)}
                    value={nombre}
                    style={styles.input}
                />
                <TextInput
                    label="Teléfono"
                    placeholder="Ingresa tu teléfono"
                    onChangeText={texto => guardarTelefono(texto)}
                    value={telefono}
                    style={styles.input}
                />
                <TextInput
                    label="Correo"
                    placeholder="Ingresa tu correo electrónico"
                    onChangeText={texto => guardarCorreo(texto)}
                    value={correo}
                    style={styles.input}
                />
                <TextInput
                    label="Empresa"
                    placeholder="Ingresa el nombre de la empresa"
                    onChangeText={texto => guardarEmpresa(texto)}
                    value={empresa}
                    style={styles.input}
                />
                <Button icon="pencil-circle" mode="contained" onPress={() => guardarCliente()}>
                    Guardar Cliente
                </Button>
                <Portal>
                    <Dialog
                        visible={alerta}
                        onDismiss={() => guardarAlerta(false)}
                    >
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Todos los campos son obligatorios</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => guardarAlerta(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        backgroundColor: 'transparent'
    }
});
 
export default NuevoCliente;