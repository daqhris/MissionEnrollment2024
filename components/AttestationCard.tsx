import React from "react";
import tw from "tailwind-styled-components";
import { Attestation } from "../types/attestation";

const Card = tw.div`
  mt-6
  rounded-lg
  overflow-hidden
  bg-white
  shadow-md
`;

const Header = tw.div`
  bg-blue-600
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
  p-4
  space-y-3
`;

const Label = tw.p`
  text-sm
  text-gray-600
  font-semibold
  mb-1
`;

const Value = tw.p`
  text-sm
  break-all
  bg-gray-100
  p-2
  rounded
  text-gray-800
`;

const Link = tw.a`
  text-blue-600
  hover:text-blue-800
  transition-colors
  duration-300
  underline
  text-sm
`;

type Props = {
  attestation: Attestation;
};

export const AttestationCard: React.FC<Props> = ({ attestation }) => {
  return (
    <Card>
      <Header>
        <Title>Attestation</Title>
      </Header>
      <Content>
        <div>
          <Label>Attester:</Label>
          <Value>{attestation.attester}</Value>
        </div>
        <div>
          <Label>Recipient:</Label>
          <Value>{attestation.recipient}</Value>
        </div>
        <div>
          <Label>Reference UID:</Label>
          <Value>{attestation.refUID}</Value>
        </div>
        <div>
          <Label>Revocable:</Label>
          <Value>{attestation.revocable ? 'Yes' : 'No'}</Value>
        </div>
        <div>
          <Label>Revocation Time:</Label>
          <Value>{attestation.revocationTime || 'N/A'}</Value>
        </div>
        <div>
          <Label>Expiration Time:</Label>
          <Value>{attestation.expirationTime || 'N/A'}</Value>
        </div>
        <div>
          <Label>Data:</Label>
          <Value>{attestation.data}</Value>
        </div>
        <div>
          <Link href={`https://sepolia.easscan.org/attestation/view/${attestation.id}`} target="_blank" rel="noopener noreferrer">
            View on EAS Explorer
          </Link>
        </div>
      </Content>
    </Card>
  );
};
