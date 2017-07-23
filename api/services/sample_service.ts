import { CollectionService } from './collection_service';
import { User } from '../models/user';
import { MetadataService } from './metadata_service';
import { ProjectService } from './project_service';
import { EnvironmentService } from './environment_service';
import { DtoEnvironment } from '../interfaces/dto_environment';
import { Setting } from '../utils/setting';
import { StringUtil } from '../utils/string_util';

export class SampleService {

    private static sampleCollection: any;

    private static init() {
        if (!!SampleService.sampleCollection) {
            return;
        }
        SampleService.sampleCollection = require('../../sample collection.json');
    }

    static async createSampleForUser(owner: User, projectId: string) {

        SampleService.init();

        const collection = await MetadataService.convertPostmanCollectionV1(owner, projectId, SampleService.sampleCollection);

        await CollectionService.save(collection);

        let apiHost = (<string>Setting.instance.app.api).replace('http://', '').replace('https://', '');
        apiHost = apiHost.substr(0, apiHost.length - 1);
        const dtoEnv: DtoEnvironment = { id: StringUtil.generateUID(), name: 'Sample Env', project: { id: projectId }, variables: [{ id: StringUtil.generateUID(), key: 'apihost', value: apiHost, isActive: true, sort: 0 }] };

        await EnvironmentService.create(dtoEnv);
    }
}