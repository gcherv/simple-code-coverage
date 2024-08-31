import {Org, Connection, AuthInfo} from '@salesforce/core';

// main function for calculating code coverage
export async function calculateCodeCoverage(fileName: string) {	
	const conn = await getConnection();
	const result = await conn.tooling.query<{ApexClassOrTrigger: {Name: string}, NumLinesCovered: number, NumLinesUncovered: number}>('SELECT ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered FROM ApexCodeCoverageAggregate WHERE ApexClassOrTrigger.Name = \''+fileName+'\' LIMIT 1'); 
	const coverageAggregate = result.records[0]; 

	if(!result.records || !coverageAggregate || (coverageAggregate.NumLinesCovered === 0 && coverageAggregate.NumLinesUncovered === 0)){
		return;
	}

	const totalLines = coverageAggregate.NumLinesCovered + coverageAggregate.NumLinesUncovered;

	return (coverageAggregate.NumLinesCovered / totalLines) * 100;
};

// Connection to the user's standard org
async function getConnection() {
	let org = await Org.create({});

	let conn = await Connection.create({ 
		authInfo: await AuthInfo.create({ username: org.getUsername() })
	});
	
	return conn;
};