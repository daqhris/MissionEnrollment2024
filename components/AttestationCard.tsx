import React from "react";
import { AttestationShareablePackageObject, createOffchainURL } from "@ethereum-attestation-service/eas-sdk";
import tw from "tailwind-styled-components";
import { Checkmark } from "~~/components/assets/Checkmark";

const Card = tw.div`
  mt-6
  rounded-lg
  overflow-hidden
`;

const Header = tw.div`
  bg-info
  px-4
  py-2
  flex
  items-center
`;

const Title = tw.h3`
  font-bold
  text-lg
  text-white
  mb-0
`;

const Content = tw.div`
  p-3
  space-y-3
  bg-gray-700
`;

const Label = tw.p`
  text-sm
  text-gray-400
  mb-1
  mt-0
`;

const Value = tw.p`
  font-mono
  text-xs
  break-all
  bg-gray-800
  p-2
  rounded
  text-gray-300
  mt-0
`;

const Link = tw.a`
  block
  text-indigo-400
  hover:text-indigo-300
  transition-colors
  duration-300
  underline
  text-sm
  cursor-pointer
`;

const Footer = tw.div`
  bg-info
  px-4
  py-2
  flex
  justify-between
  items-center
  rounded-b-lg
`;

const FooterText = tw.span`
  text-xs
  text-indigo-200
`;

const handleAttestationClick = (result: AttestationShareablePackageObject) => {
  const url = createOffchainURL(result);
  window.open(`https://sepolia.easscan.org${url}`, "_blank");
};

function isAttestationShareablePackageObject(pkg: any): pkg is AttestationShareablePackageObject {
  return "signer" in pkg && "message" in pkg.sig;
}

type Props = {
  pkg: AttestationShareablePackageObject | { sig: { uid: string }; signer: string };
};

export const AttestationCard = ({ pkg }: Props) => {
  return (
    <Card>
      <Header>
        <Title>EAS Attestation</Title>
      </Header>
      <Content>
        <div>
          <Label>Attestation UID:</Label>
          <Value>{pkg.sig.uid}</Value>
        </div>
        <div>
          {isAttestationShareablePackageObject(pkg) ? (
            <Link onClick={() => handleAttestationClick(pkg)} target="_blank" rel="noopener noreferrer">
              View Attestation Details
            </Link>
          ) : (
            <Link target="_blank" href={`https://sepolia.easscan.org/offchain/attestation/view/${pkg.sig.uid}`}>
              View Attestation Details
            </Link>
          )}
        </div>
      </Content>
      <Footer>
        <FooterText>Verified by EAS</FooterText>
        <Checkmark className={"text-indigo-200"} />
      </Footer>
    </Card>
  );
};
