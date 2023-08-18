import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
  DnsValidatedCertificate,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import {
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";

export interface DnsAndCertificateProps {
  zone: IHostedZone;
  hostname: string;
  cloudfront?: boolean;
  certificateArn?: string;
}

export class DnsAndCertificateConstruct extends Construct {
  public readonly zone: IHostedZone;
  public readonly certificate: ICertificate;

  private readonly hostname: string;
  private readonly zoneName: string;

  constructor(scope: Construct, id: string, props: DnsAndCertificateProps) {
    super(scope, id);

    const { zone, cloudfront, hostname, certificateArn = "" } = props;

    // Use custom domain and hostname for ALB. The Route53 Zone must be in the same account.
    const { zoneName = "", hostedZoneId = "" } = zone;
    const createCert = !certificateArn;
    if (!(zoneName && hostedZoneId)) {
      throw new Error("Route53 domain details are required");
    }
    this.hostname = hostname;
    this.zoneName = zoneName;

    // Use existing Certificate if supplied, or create new one. Existing Certificate must be in the same Account and Region.
    // Creating a certificate will try to create auth records in the Route53 DNS zone.
    if (!cloudfront) {
      this.certificate = createCert
        ? new Certificate(this, "cert", {
            domainName: `${hostname}.${zoneName}`,
            validation: CertificateValidation.fromDns(this.zone),
          })
        : Certificate.fromCertificateArn(this, "cert", certificateArn);
    } else {
      this.certificate = createCert
        ? new DnsValidatedCertificate(this, "certUs", {
            domainName: `${hostname}.${zoneName}`,
            hostedZone: props.zone,
            region: "us-east-1", // Cloudfront only checks this region for certificates.
          })
        : Certificate.fromCertificateArn(this, "certUs", certificateArn);
    }
  }

  getViewerCertificate(): ViewerCertificate {
    const viewerCertificate = ViewerCertificate.fromAcmCertificate(
      this.certificate,
      {
        aliases: [`${this.hostname}.${this.zoneName}`],
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
        sslMethod: SSLMethod.SNI,
      }
    );
    return viewerCertificate;
  }
}
