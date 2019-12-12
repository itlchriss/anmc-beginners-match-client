export default class Assembly {
    constructor(data) {
        this.zhName = '';
        this.enName = '';
        this.stageType = '';
        this.heightType = '';
        this.numOfEJ = '';
        this.numOfSJ = '';
        this.dives = '';
        this.id = '';
        this.heightTypeName = '';
        this.stageTypeName = '';
        if (data) this.setData(data);
    }
    setData({ ZhName, EnName, StageType, HeightType, NumOfExecJudges, NumOfSyncJudges, Dives, Id, HeightTypeName, StageTypeName} ) {
        this.zhName = ZhName || '';
        this.enName = EnName || '';
        this.stageType = StageType || '';
        this.heightType = HeightType || '';
        this.numOfEJ = NumOfExecJudges || '';
        this.numOfSJ = NumOfSyncJudges || '';
        this.dives = Dives || '';
        this.id = Id || '';
        this.heightTypeName = HeightTypeName || '';
        this.stageTypeName = StageTypeName || '';
    }
    getWebServiceObject() {
        let {
            zhName: ZhName, enName: EnName, stageType: StageType, heightType: HeightType,
            numOfEJ: NumOfExecJudges, numOfSJ: NumOfSyncJudges, dives: Dives, id: Id
        } = this;
    }
}