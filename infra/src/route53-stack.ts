import { Stack } from "aws-cdk-lib";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";

export class Route53Stack extends Stack {
  public readonly zone: IHostedZone;
  constructor(scope: any, id: string) {
    super(scope, id);

    //get the
    // DNS Zone
    this.zone = HostedZone.fromHostedZoneAttributes(this, "zone", {
      hostedZoneId: process.env.HOSTED_ZONE_ID!,
      zoneName: process.env.HOSTED_ZONE_NAME!,
    });
  }
}
