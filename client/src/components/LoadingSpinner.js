import styled from "styled-components";

export const LoadingSpinner = () => {
    return (
        <LoadingContainer>
            <LoadingWidget />
        </LoadingContainer>
    )
};

const LoadingContainer = styled.div`
    position: relative;
    display: flex;
    align-self: center;
    margin-top: 80px;
    background: none;
`;

const LoadingWidget = styled.div`
    position: absolute;
    width: 35px;
    height: 35px;
    border: 5px solid #e1dbd7;
    border-top: 5px solid #b6b0ab;
    border-radius: 50%;
    animation: spin 1000ms linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;