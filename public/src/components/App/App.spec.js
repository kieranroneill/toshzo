'use strict';

import App from './App';

describe('<App />', () => {
    it('should have a div', () => {
        const wrapper = shallow(<App />);

        expect(wrapper.find('div')).to.have.length(1);
        expect(wrapper.find('div').text()).to.equal('Hello World!');
    });
});
