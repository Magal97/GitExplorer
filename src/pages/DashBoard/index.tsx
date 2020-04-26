import React, {useState, FormEvent, useEffect} from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/Logo.svg';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const DashBoard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storedRepositories = localStorage.getItem('@GitHubExplorer:repositories');

        if(storedRepositories){
            return JSON.parse(storedRepositories);
        }else{
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem('@GitHubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o nome do repositório');
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;
            setRepositories([...repositories, repository]);
            setInputError('');
            setNewRepo('');

        }catch(err){
            setInputError('Erro na busca do repositório');
        }

    }

    return(
    <>
        <img src={logoImg} alt="logo"/>
        <Title>Explore repositórios no GitHub</Title>
        <Form hasError={!!inputError} onSubmit={handleAddRepository} >
            <input value={newRepo}
            onChange={(e) => setNewRepo(e.target.value)}  placeholder="Digite o nome do repositório"/>
            <button type="submit" >Pesquisar</button>
        </Form>
            { inputError && <Error>{inputError}</Error>}
        <Repositories>
           {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repository/${repository.full_name}`} >
                <img src={repository.owner.avatar_url}
                alt={repository.owner.login} />
             <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>

             </div>
             <FiChevronRight size={20}/>
            </Link>
           ))}
        </Repositories>
    </>
    );
};

export default DashBoard;
