import styled from "styled-components";

export const CartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
`;

export const CartSidebar = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 350px;
  background: white;
  z-index: 10;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
`;

export const CartHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CartTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const CartContent = styled.div`
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 60px);
`;

export const EmptyCartImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
`;

export const EmptyCartImage = styled.img`
  max-width: 80%;
`;

export const CartItem = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 4px;
`;

export const ItemDetails = styled.div`
  flex: 1;
`;

export const ItemTitle = styled.h4`
  font-size: 16px;
  margin-bottom: 4px;
`;

export const ItemPriceQuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ItemPrice = styled.span`
  font-weight: bold;
`;

export const TotalSection = styled.div`
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`;

export const TotalLabel = styled.span`
  font-weight: bold;
`;

export const TotalValue = styled.span`
  font-weight: bold;
`;

export const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  margin-left: 8px;
`;
