import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table, TableSchema } from './schemas/table.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name:Table.name, schema:TableSchema}])
  ],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
