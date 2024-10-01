import {Org, Connection, AuthInfo} from '@salesforce/core';

// main function for calculating code coverage
export async function calculateCodeCoverage(fileName: string) {	
	const conn = await getConnection();
	const result = await conn.tooling.query<{ApexClassOrTrigger: {Name: string}, NumLinesCovered: number, NumLinesUncovered: number}>('SELECT ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered FROM ApexCodeCoverageAggregate WHERE ApexClassOrTrigger.Name = \''+fileName+'\' LIMIT 1'); 
	const coverageAggregate = result.records[0]; 

	if(!result.records || !coverageAggregate || coverageAggregate.NumLinesCovered === 0 || coverageAggregate.NumLinesUncovered === 0){
		return;
	}

	const totalLines = coverageAggregate.NumLinesCovered + coverageAggregate.NumLinesUncovered;

	const percentage = (coverageAggregate.NumLinesCovered / totalLines) * 100;
	var nextPercentage = Math.trunc(percentage + 1);
	var linesToNextPercentage;

	if(nextPercentage <= 100){
		if(totalLines >= 100){
			linesToNextPercentage = Math.ceil((nextPercentage / 100) * totalLines) - coverageAggregate.NumLinesCovered;
		} else {
			linesToNextPercentage = 1;
			nextPercentage = Math.trunc((coverageAggregate.NumLinesCovered + 1) / totalLines * 100);
		}
	}

	return {percentage, linesToNextPercentage, nextPercentage};
};

// Connection to the user's standard org
async function getConnection() {
	let org = await Org.create({});

	let conn = await Connection.create({ 
		authInfo: await AuthInfo.create({ username: org.getUsername() })
	});
	
	return conn;
};