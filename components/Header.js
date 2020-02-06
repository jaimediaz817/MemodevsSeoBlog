import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,  
  NavbarText
} from 'reactstrap';
import { APP_NAME } from '../config';
import Link from 'next/link';
import { signout, isAuth } from '../actions/auth';
import Router from 'next/router';
import NProgress from 'nprogress';
import '.././node_modules/nprogress/nprogress.css';
import Search from './blog/Search';

// NPROGRESS
Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
	<React.Fragment>
		<Navbar color="light" light expand="md">
			<NavbarBrand>
				<Link href="/" className="font-weight-bold">
					<a>{ APP_NAME }</a>
				</Link>            
			</NavbarBrand>
			<NavbarToggler onClick={toggle} />
			<Collapse isOpen={isOpen} navbar>
			<Nav className="ml-auto" navbar>

			<React.Fragment>
				<NavItem>
					<Link href="/blogs">
						<NavLink>Blogs</NavLink>
					</Link>												
				</NavItem>

				<NavItem>
					<Link href="/contact">
						<NavLink><a>Contacto</a></NavLink>
					</Link>												
				</NavItem>				

			</React.Fragment>			
			
				{ !isAuth() && (
					<React.Fragment>
						<NavItem>
							<NavLink>
								<Link href="/signin">
									<a>Signin</a>
								</Link>
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink>
								<Link href="/signup">
									<a>Signup</a>
								</Link>
							</NavLink>
						</NavItem>
					</React.Fragment>
				)}

				{ isAuth() && isAuth().role == 0 && (
					<NavItem>									
						<Link href="/user">
							<NavLink>
								{`${isAuth().name} - Dashboard`}
							</NavLink>
						</Link>
					</NavItem>
				)}

				{ isAuth() && isAuth().role == 1 && (
					<NavItem>									
						<Link href="/admin">
							<NavLink>
								{`${isAuth().name} - Dashboard`}
							</NavLink>
						</Link>
					</NavItem>
				)}

				{ isAuth() && (
					<NavItem>									
						<NavLink 
							style={{ 'cursor': 'pointer' }}
							onClick={
								()=> signout(()=> {
									Router.replace(`/signin`)
							})
						}>Cerrar sesión</NavLink>					
					</NavItem>
				)}	

				
				{ /*  P U B L I C O  */ }

				<NavItem>
					<a href="/user/crud/blog" className="btn btn-primary text-light">Escribir un Blog</a>					
				</NavItem>

			</Nav>
		</Collapse>
		</Navbar>
		<Search />
	</React.Fragment>
  );
}

export default Header;