import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as excelToJson from 'convert-excel-to-json';
import { competenciaDto } from '../competencia/dto/competencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Competencia } from '../competencia/schema/competencia.schema';
import { Model } from 'mongoose';
import { ProgramaDto } from 'src/programa/dto/programa.dto';
import { Programa } from 'src/programa/schema/programa.schema';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CargueMasivoCompetenciasService {
  constructor(
    @InjectModel(Competencia.name) private competenciaModel: Model<Competencia>,
    @InjectModel(Programa.name) private programaModel: Model<Programa>,

    private readonly usersService: UsersService,
  ) {}

  async processCsv(
    file: Express.Multer.File,
    programa: string,
  ): Promise<string> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson); //Obtener keys de las hojas del excel

    const obj = {
      programa: programa,
      competencias: [],
    };
    //Recorremos hoja por hoja el excel
    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const competencia of excelJson[hoja]) {
        const compe = {
          codigo: competencia['A'], //Código de la competencia en la Columna A del excel
          nombre: competencia['B'], //Nombre de la competencia en la Columna B del excel
          duracion: parseInt(competencia['C']),
          resultados: [],
        };

        //Key de la competencia(Fila del excel)
        const columnas = Object.keys(competencia);
        for (let x = 3; x < columnas.length; x += 3) {
          if (competencia[columnas[x]] != '') {
            const pq = {
              descripcion: competencia[columnas[x]],
              orden: competencia[columnas[x + 1]],
              duracion: parseInt(competencia[columnas[x + 2]]),
            };
            compe.resultados.push(JSON.parse(JSON.stringify(pq)));
          } else break;
        }
        obj.competencias.push(JSON.parse(JSON.stringify(compe)));
      }
    }
    fs.unlinkSync(file.path);
    this.crearCompetencia(obj);
    return 'ok';
  }

  async processProgramas(file: Express.Multer.File): Promise<string> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson);

    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const columna of excelJson[hoja]) {
        const paquete = {
          codigo: columna['A'], //Código de la competencia en la Columna A del excel
          nombre: columna['B'], //Nombre de la competencia en la Columna B del excel
          nivel: columna['C'],
          version: columna['D'],
          duracion: columna['E'],
          intensidad_horaria: columna['F'],
        };
        this.crearPrograma(paquete);
      }
    }
    fs.unlinkSync(file.path);
    return 'ok';
  }

  async processInstructor(
    file: Express.Multer.File,
    centro: string,
  ): Promise<any> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson); //Obtener keys de las hojas del excel
    const nuevosInstructores: any[] = []

    //Recorremos hoja por hoja el excel
    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const columna of excelJson[hoja]) {
        const instructor = {
          documento: columna['A'], //Código de la competencia en la Columna A del excel
          nombre: columna['B'], //Nombre de la competencia en la Co password:
          apellido: columna['C'],
          correo: columna['D'],
          celular: columna['E'],
          password: columna['A'].toString(),
          centro: centro,
          contrato: {
            numero: columna['F'],
            fechaInicio: columna['G'],
            fechaTerminacion: columna['H'],
            tipoVinculacion: columna['I'],
          },
          roles: ['Instructor'],
          programas: [],
        };

        //Key de la competencia(Fila del excel)
        /* const columnas = Object.keys(columna);
        for (let x = 9; x < columnas.length; x++) {
          if (columna[columnas[x]] != '') {
             instructor.programas.push(columna[columnas[x]]);
          } else break;
        }*/

        const nuevoInstructor = await this.usersService.crearUser(instructor);
        if (nuevoInstructor) {
            nuevosInstructores.push(nuevoInstructor)    
        }
        
        // this.crearInstructor(instructor);
      }
    }
    fs.unlinkSync(file.path);
    return nuevosInstructores;
  }

  async crearCompetencia(competencia: competenciaDto): Promise<Competencia> {
    const newCompetencia = new this.competenciaModel(competencia);
    return await newCompetencia.save();
  }

  async crearPrograma(programa: ProgramaDto): Promise<Programa> {
    const newPrograma = new this.programaModel(programa);
    return await newPrograma.save();
  }
}
