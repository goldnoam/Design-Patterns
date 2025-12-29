
import { DesignPattern, PatternCategory } from './types';

export const DESIGN_PATTERNS: DesignPattern[] = [
  {
    id: 'singleton',
    name: 'Singleton',
    category: PatternCategory.CREATIONAL,
    description: 'Ensures a class has only one instance and provides a global point of access to it.',
    whenToUse: [
      'When you need exactly one instance of a class (e.g., Database connection, Logger, Configuration manager).',
      'When you need to provide a global access point to that instance.'
    ],
    pros: [
      'Strict control over instance creation.',
      'Memory saving by reusing the same instance.',
      'Delayed initialization (lazy loading).'
    ],
    cons: [
      'Violates Single Responsibility Principle.',
      'Can hide bad design (global state).',
      'Difficult to unit test due to global state.'
    ],
    codeExample: `class Singleton {
private:
    static Singleton* instance;
    Singleton() {} // Private constructor

public:
    // Delete copy constructor and assignment operator
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }

    void doSomething() {
        std::cout << "Singleton is working!\\n";
    }
};

// Initialize static member
Singleton* Singleton::instance = nullptr;`
  },
  {
    id: 'lazy-init',
    name: 'Lazy Initialization',
    category: PatternCategory.CREATIONAL,
    description: 'Delays the creation of an object, the calculation of a value, or some other expensive process until the first time it is needed.',
    whenToUse: [
      'When the object is expensive to create and might not be used at all.',
      'To reduce startup time by spreading initialization costs over the program runtime.'
    ],
    pros: [
      'Improves application startup performance.',
      'Saves resources if objects are never used.',
      'Supports handling circular dependencies by creating objects on-demand.'
    ],
    cons: [
      'Introduction of a slight performance hit on the first access.',
      'Potential thread-safety issues if not implemented correctly with mutexes.'
    ],
    codeExample: `class ExpensiveObject {
public:
    ExpensiveObject() { /* Intense work */ }
    void Use() { std::cout << "Using object\\n"; }
};

class LazyWrapper {
private:
    std::unique_ptr<ExpensiveObject> instance;
public:
    ExpensiveObject* getInstance() {
        if (!instance) {
            std::cout << "Creating object lazily...\\n";
            instance = std::make_unique<ExpensiveObject>();
        }
        return instance.get();
    }
};`
  },
  {
    id: 'pimpl',
    name: 'Pimpl (Pointer to Impl)',
    category: PatternCategory.STRUCTURAL,
    description: 'Removes implementation details of a class from its object representation by placing them in a separate class, accessed via an opaque pointer.',
    whenToUse: [
      'To reduce compilation times by breaking header dependencies.',
      'To provide a stable Binary Interface (ABI) for libraries.',
      'To hide private implementation details from the user.'
    ],
    pros: [
      'Compilation firewall: changing private members doesn\'t require recompiling client code.',
      'Clean headers: only the public interface is visible.',
      'Improved encapsulation.'
    ],
    cons: [
      'Extra indirection through a pointer affects performance slightly.',
      'Added complexity of managing the lifetime of the implementation object.'
    ],
    codeExample: `// Widget.h
class Widget {
public:
    Widget();
    ~Widget();
    void DoSomething();
private:
    class Impl;
    std::unique_ptr<Impl> pImpl;
};

// Widget.cpp
class Widget::Impl {
public:
    void InternalMethod() { /* ... */ }
};

Widget::Widget() : pImpl(std::make_unique<Impl>()) {}
Widget::~Widget() = default;
void Widget::DoSomething() { pImpl->InternalMethod(); }`
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    category: PatternCategory.BEHAVIORAL,
    description: 'Specifies how to evaluate sentences in a language. It defines a grammatical representation for a language along with an interpreter to interpret the sentences.',
    whenToUse: [
      'When you have a language to interpret and you can represent statements in that language as abstract syntax trees.',
      'For parsing simple configuration languages or mathematical expressions.'
    ],
    pros: [
      'Easy to change or extend the grammar.',
      'Implementing the grammar is straightforward with classes representing rules.'
    ],
    cons: [
      'Complex grammars are hard to maintain with the Interpreter pattern.',
      'Performance can be an issue for large expressions compared to a dedicated parser.'
    ],
    codeExample: `class Expression {
public:
    virtual ~Expression() {}
    virtual bool interpret(const std::string& context) = 0;
};

class TerminalExpression : public Expression {
    std::string data;
public:
    TerminalExpression(std::string d) : data(d) {}
    bool interpret(const std::string& context) override {
        return context.find(data) != std::string::npos;
    }
};

class OrExpression : public Expression {
    Expression *expr1, *expr2;
public:
    OrExpression(Expression* e1, Expression* e2) : expr1(e1), expr2(e2) {}
    bool interpret(const std::string& context) override {
        return expr1->interpret(context) || expr2->interpret(context);
    }
};`
  },
  {
    id: 'object-pool',
    name: 'Object Pool',
    category: PatternCategory.CREATIONAL,
    description: 'Uses a set of initialized objects kept in a ready-to-use "pool" rather than destroying and re-creating them on demand.',
    whenToUse: [
      'When creating and destroying objects is expensive (e.g., Database connections, Threads).',
      'When there is a high frequency of object usage and return.'
    ],
    pros: [
      'Significant performance gain in high-frequency allocation scenarios.',
      'Predictable memory usage and limits on resource consumption.'
    ],
    cons: [
      'The pool itself consumes memory even when objects are idle.',
      'Objects must be correctly reset before being returned to the pool.'
    ],
    codeExample: `class Resource {
public:
    void Reset() { /* Clear state */ }
};

class ObjectPool {
private:
    std::vector<std::unique_ptr<Resource>> pool;
public:
    Resource* Acquire() {
        if (pool.empty()) return new Resource();
        auto res = std::move(pool.back());
        pool.pop_back();
        return res.release();
    }
    void Release(Resource* res) {
        res->Reset();
        pool.push_back(std::unique_ptr<Resource>(res));
    }
};`
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you copy existing objects without making your code dependent on their classes.',
    whenToUse: [
      'When your code shouldn\'t depend on the concrete classes of objects that you need to copy.',
      'When you want to reduce the number of subclasses that only differ in the way they initialize their respective objects.'
    ],
    pros: [
      'You can clone objects without coupling to their concrete classes.',
      'You can get rid of repeated initialization code in favor of cloning pre-configured prototypes.',
      'You can produce complex objects more conveniently.'
    ],
    cons: [
      'Cloning complex objects that have circular references might be very tricky.'
    ],
    codeExample: `class Prototype {
public:
    virtual ~Prototype() {}
    virtual Prototype* clone() const = 0;
    virtual void method() = 0;
};

class ConcretePrototype : public Prototype {
private:
    std::string field;
public:
    ConcretePrototype(std::string f) : field(f) {}
    Prototype* clone() const override {
        return new ConcretePrototype(*this);
    }
    void method() override {
        std::cout << "Prototype field: " << field << "\\n";
    }
};`
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you produce families of related objects without specifying their concrete classes.',
    whenToUse: [
      'When your code needs to work with various families of related products.',
      'When you want to provide a library of products and you want to expose only their interfaces, not their implementations.'
    ],
    pros: [
      'Compatibility between products is guaranteed.',
      'Avoids tight coupling between concrete products and client code.',
      'Supports Open/Closed Principle.'
    ],
    cons: [
      'Code may become more complicated due to many new interfaces and classes.'
    ],
    codeExample: `class AbstractProductA {
public:
    virtual ~AbstractProductA() {};
    virtual std::string UsefulFunctionA() const = 0;
};

class ConcreteProductA1 : public AbstractProductA {
public:
    std::string UsefulFunctionA() const override { return "Result of Product A1."; }
};

class AbstractFactory {
public:
    virtual AbstractProductA *CreateProductA() const = 0;
    virtual ~AbstractFactory() {};
};

class ConcreteFactory1 : public AbstractFactory {
public:
    AbstractProductA *CreateProductA() const override { return new ConcreteProductA1(); }
};`
  },
  {
    id: 'builder',
    name: 'Builder',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.',
    whenToUse: [
      'To avoid "telescoping constructors" (constructors with 10+ parameters).',
      'When you want your code to be able to create different representations of some product.'
    ],
    pros: [
      'Allows constructing objects step-by-step, deferring construction steps or running steps recursively.',
      'You can reuse the same construction code when building various representations of products.',
      'Isolation of complex construction code from business logic.'
    ],
    cons: [
      'Overall complexity increases as the pattern requires creating multiple new classes.'
    ],
    codeExample: `class Product {
public:
    std::vector<std::string> parts_;
    void ListParts() const {
        for (const auto& p : parts_) std::cout << p << " ";
        std::cout << "\\n";
    }
};

class Builder {
public:
    virtual ~Builder() {}
    virtual void ProducePartA() const = 0;
    virtual void ProducePartB() const = 0;
};

class ConcreteBuilder1 : public Builder {
private:
    Product* product;
public:
    ConcreteBuilder1() { this->Reset(); }
    void Reset() { this->product = new Product(); }
    void ProducePartA() const override { this->product->parts_.push_back("PartA1"); }
    void ProducePartB() const override { this->product->parts_.push_back("PartB1"); }
    Product* GetProduct() { 
        Product* result = this->product;
        this->Reset();
        return result;
    }
};`
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: PatternCategory.CREATIONAL,
    description: 'Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    whenToUse: [
      'When the creator class doesn\'t know which exact subclasses it needs to create.',
      'When you want to delegate the responsibility of object creation to subclasses.'
    ],
    pros: [
      'Decouples the creator from the concrete products.',
      'Supports Open/Closed Principle.',
      'Simplifies code by moving creation logic to one place.'
    ],
    cons: [
      'Can make code more complex by requiring many new subclasses.'
    ],
    codeExample: `class Product {
public:
    virtual ~Product() {}
    virtual std::string Operation() const = 0;
};

class ConcreteProduct1 : public Product {
public:
    std::string Operation() const override { return "Result of ConcreteProduct1"; }
};

class Creator {
public:
    virtual ~Creator() {}
    virtual Product* FactoryMethod() const = 0;

    std::string SomeOperation() const {
        Product* product = this->FactoryMethod();
        std::string result = "Creator: " + product->Operation();
        delete product;
        return result;
    }
};

class ConcreteCreator1 : public Creator {
public:
    Product* FactoryMethod() const override { return new ConcreteProduct1(); }
};`
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: PatternCategory.STRUCTURAL,
    description: 'Lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other.',
    whenToUse: [
      'When you want to divide and organize a monolithic class that has several variants of some functionality.',
      'When you need to extend a class in several orthogonal dimensions.'
    ],
    pros: [
      'You can create platform-independent classes and apps.',
      'The client code works with high-level abstractions. It isn\'t exposed to the platform details.',
      'Open/Closed Principle. You can introduce new abstractions and implementations independently from each other.'
    ],
    cons: [
      'You might make the code more complicated by applying the pattern to a highly cohesive class.'
    ],
    codeExample: `class Implementation {
public:
    virtual ~Implementation() {}
    virtual std::string OperationImplementation() const = 0;
};

class ConcreteImplementationA : public Implementation {
public:
    std::string OperationImplementation() const override {
        return "ConcreteImplementationA: Here's the result on the platform A.\\n";
    }
};

class Abstraction {
protected:
    Implementation* implementation_;
public:
    Abstraction(Implementation* implementation) : implementation_(implementation) {}
    virtual ~Abstraction() {}
    virtual std::string Operation() const {
        return "Abstraction: Base operation with:\\n" + this->implementation_->OperationImplementation();
    }
};`
  },
  {
    id: 'composite',
    name: 'Composite',
    category: PatternCategory.STRUCTURAL,
    description: 'Lets you compose objects into tree structures and then work with these structures as if they were individual objects.',
    whenToUse: [
      'When you need to implement a tree-like object structure.',
      'When you want the client code to treat both simple and complex elements uniformly.'
    ],
    pros: [
      'You can work with complex tree structures more conveniently.',
      'Open/Closed Principle: you can introduce new element types into the tree without breaking existing code.'
    ],
    cons: [
      'It might be difficult to provide a common interface for classes whose functionality differs too much.'
    ],
    codeExample: `class Component {
protected:
    Component *parent_;
public:
    virtual ~Component() {}
    virtual std::string Operation() const = 0;
    virtual void Add(Component *component) {}
    virtual void Remove(Component *component) {}
    virtual bool IsComposite() const { return false; }
};

class Leaf : public Component {
public:
    std::string Operation() const override { return "Leaf"; }
};

class Composite : public Component {
protected:
    std::list<Component *> children_;
public:
    void Add(Component *component) override {
        this->children_.push_back(component);
    }
    bool IsComposite() const override { return true; }
    std::string Operation() const override {
        std::string result;
        for (const Component *c : children_) {
            result += c->Operation() + "+";
        }
        return "Branch(" + result + ")";
    }
};`
  },
  {
    id: 'facade',
    name: 'Facade',
    category: PatternCategory.STRUCTURAL,
    description: 'Provides a simplified interface to a library, a framework, or any other complex set of classes.',
    whenToUse: [
      'When you need to have a limited but straightforward interface to a complex subsystem.',
      'When you want to structure a subsystem into layers.'
    ],
    pros: [
      'You can isolate your code from the complexity of a subsystem.',
      'Promotes weak coupling between the subsystem and its clients.'
    ],
    cons: [
      'A facade can become a god object coupled to all classes of an app.'
    ],
    codeExample: `class Subsystem1 {
public:
    std::string Operation1() const { return "Subsystem1: Ready!\\n"; }
};

class Subsystem2 {
public:
    std::string OperationZ() const { return "Subsystem2: Fire!\\n"; }
};

class Facade {
protected:
    Subsystem1 *subsystem1_;
    Subsystem2 *subsystem2_;
public:
    Facade(Subsystem1 *s1 = nullptr, Subsystem2 *s2 = nullptr) {
        this->subsystem1_ = s1 ?: new Subsystem1;
        this->subsystem2_ = s2 ?: new Subsystem2;
    }
    std::string Operation() {
        std::string result = "Facade initializes subsystems:\\n";
        result += this->subsystem1_->Operation1();
        result += this->subsystem2_->OperationZ();
        return result;
    }
};`
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: PatternCategory.STRUCTURAL,
    description: 'Lets you fit more objects into the available amount of RAM by sharing common parts of state between multiple objects instead of keeping all of the data in each object.',
    whenToUse: [
      'Only when your program must spawn a huge number of similar objects.',
      'When your RAM is exhausted by the sheer number of objects.'
    ],
    pros: [
      'You can save lots of RAM, assuming your program has tons of similar objects.'
    ],
    cons: [
      'You might be exchanging RAM for CPU cycles when some of the shared data has to be recalculated each time it\'s needed.',
      'The code becomes much more complicated.'
    ],
    codeExample: `struct SharedState {
    std::string brand_;
    std::string model_;
    std::string color_;
};

class Flyweight {
private:
    SharedState *shared_state_;
public:
    Flyweight(const SharedState *shared_state) : shared_state_(new SharedState(*shared_state)) {}
    void Operation(const std::string& unique_state) const {
        std::cout << "Flyweight: Displaying shared (" << shared_state_->brand_ << ") and unique (" << unique_state << ") state.\\n";
    }
};

class FlyweightFactory {
private:
    std::unordered_map<std::string, Flyweight> flyweights_;
public:
    Flyweight GetFlyweight(const SharedState& shared_state) {
        std::string key = shared_state.brand_ + "_" + shared_state.model_;
        if (this->flyweights_.find(key) == this->flyweights_.end()) {
            this->flyweights_.insert({key, Flyweight(&shared_state)});
        }
        return this->flyweights_.at(key);
    }
};`
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: PatternCategory.STRUCTURAL,
    description: 'Lets you provide a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform something either before or after the request gets through to the original object.',
    whenToUse: [
      'Lazy initialization (virtual proxy).',
      'Access control (protection proxy).',
      'Logging requests (logging proxy).',
      'Caching request results.'
    ],
    pros: [
      'You can control the service object without clients knowing about it.',
      'You can manage the lifecycle of the service object when clients don\'t care about it.',
      'The proxy works even if the service object isn\'t ready or is not available.'
    ],
    cons: [
      'The code may become more complicated since you need to introduce a lot of new classes.',
      'The response from the service might get delayed.'
    ],
    codeExample: `class Subject {
public:
    virtual void Request() const = 0;
};

class RealSubject : public Subject {
public:
    void Request() const override {
        std::cout << "RealSubject: Handling request.\\n";
    }
};

class Proxy : public Subject {
private:
    RealSubject *real_subject_;
    bool CheckAccess() const { return true; }
public:
    Proxy(RealSubject *real_subject) : real_subject_(new RealSubject(*real_subject)) {}
    ~Proxy() { delete real_subject_; }
    void Request() const override {
        if (this->CheckAccess()) {
            this->real_subject_->Request();
        }
    }
};`
  },
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.',
    whenToUse: [
      'When your program is expected to process different kinds of requests in various ways, but the exact types of requests and their sequences are unknown beforehand.',
      'When it\'s essential to execute several handlers in a particular order.'
    ],
    pros: [
      'You can control the order of request handling.',
      'Single Responsibility Principle: you can decouple classes that invoke operations from classes that perform operations.',
      'Open/Closed Principle: you can introduce new handlers without breaking existing code.'
    ],
    cons: [
      'Some requests may end up unhandled.'
    ],
    codeExample: `class Handler {
public:
    virtual Handler *SetNext(Handler *handler) = 0;
    virtual std::string Handle(std::string request) = 0;
};

class AbstractHandler : public Handler {
private:
    Handler *next_handler_;
public:
    AbstractHandler() : next_handler_(nullptr) {}
    Handler *SetNext(Handler *handler) override {
        this->next_handler_ = handler;
        return handler;
    }
    std::string Handle(std::string request) override {
        if (this->next_handler_) return this->next_handler_->Handle(request);
        return {};
    }
};

class MonkeyHandler : public AbstractHandler {
public:
    std::string Handle(std::string request) override {
        if (request == "Banana") return "Monkey: I'll eat the " + request + ".\\n";
        return AbstractHandler::Handle(request);
    }
};`
  },
  {
    id: 'mediator',
    name: 'Mediator',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you reduce chaotic dependencies between objects. The pattern restricts direct communications between the objects and forces them to collaborate only via a mediator object.',
    whenToUse: [
      'When it\'s hard to change some of the classes because they are tightly coupled to a bunch of other classes.',
      'When you can\'t reuse a component in a different program because it\'s too dependent on other components.'
    ],
    pros: [
      'Single Responsibility Principle: you can extract the communications between various components into a single place.',
      'Open/Closed Principle: you can introduce new mediators without having to change the actual components.',
      'You can reduce coupling between various components of a program.'
    ],
    cons: [
      'Over time a mediator can evolve into a God Object.'
    ],
    codeExample: `class BaseComponent;
class Mediator {
public:
    virtual void Notify(BaseComponent *sender, std::string event) const = 0;
};

class BaseComponent {
protected:
    Mediator *mediator_;
public:
    BaseComponent(Mediator *mediator = nullptr) : mediator_(mediator) {}
    void set_mediator(Mediator *mediator) { this->mediator_ = mediator; }
};

class Component1 : public BaseComponent {
public:
    void DoA() {
        std::cout << "Component 1 does A.\\n";
        this->mediator_->Notify(this, "A");
    }
};

class ConcreteMediator : public Mediator {
private:
    Component1 *component1_;
public:
    void Notify(BaseComponent *sender, std::string event) const override {
        if (event == "A") {
            std::cout << "Mediator reacts on A and triggers following operations:\\n";
        }
    }
};`
  },
  {
    id: 'memento',
    name: 'Memento',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you save and restore the previous state of an object without revealing the details of its implementation.',
    whenToUse: [
      'When you want to produce snapshots of the object\'s state to be able to restore a previous state of the object.',
      'When direct access to the object\'s fields/getters/setters violates its encapsulation.'
    ],
    pros: [
      'You can produce snapshots of the object\'s state without violating its encapsulation.',
      'You can simplify the originator\'s code by letting the caretaker maintain the history of the originator\'s state.'
    ],
    cons: [
      'The app might consume lots of RAM if clients create mementos too often.',
      'Caretakers should track the originator\'s lifecycle to be able to destroy obsolete mementos.'
    ],
    codeExample: `class Memento {
public:
    virtual ~Memento() {}
    virtual std::string GetName() const = 0;
    virtual std::string GetDate() const = 0;
    virtual std::string GetState() const = 0;
};

class ConcreteMemento : public Memento {
private:
    std::string state_;
    std::string date_;
public:
    ConcreteMemento(std::string state) : state_(state) {
        this->date_ = "2023-10-27";
    }
    std::string GetState() const override { return this->state_; }
    std::string GetName() const override { return this->date_ + " / (" + this->state_.substr(0, 9) + "...)"; }
    std::string GetDate() const override { return this->date_; }
};

class Originator {
private:
    std::string state_;
public:
    Originator(std::string state) : state_(state) {}
    void DoSomething() { this->state_ = "New State"; }
    Memento *Save() { return new ConcreteMemento(this->state_); }
    void Restore(Memento *memento) { this->state_ = memento->GetState(); }
};`
  },
  {
    id: 'observer',
    name: 'Observer',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines a subscription mechanism to notify multiple objects about any events that happen to the object they\'re observing.',
    whenToUse: [
      'When changes to the state of one object may require changing other objects.',
      'When an abstraction has two aspects, one dependent on the other.'
    ],
    pros: [
      'Establish relationships between objects at runtime.',
      'Open/Closed Principle supported: add new subscribers without changing publisher.'
    ],
    cons: [
      'Subscribers are notified in random order.',
      'Memory leaks if observers are not correctly detached.'
    ],
    codeExample: `class IObserver {
public:
    virtual ~IObserver() {}
    virtual void Update(const std::string &message_from_subject) = 0;
};

class Subject {
public:
    void Attach(IObserver *observer) { list_observer_.push_back(observer); }
    void Detach(IObserver *observer) { list_observer_.remove(observer); }
    void Notify() {
        for (auto observer : list_observer_) {
            observer->Update(message_);
        }
    }
    void CreateMessage(std::string message = "Empty") {
        this->message_ = message;
        Notify();
    }
private:
    std::list<IObserver *> list_observer_;
    std::string message_;
};`
  },
  {
    id: 'state',
    name: 'State',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.',
    whenToUse: [
      'When you have an object that behaves differently depending on its current state, the number of states is enormous, and the state-specific code changes frequently.',
      'When you have a class polluted with massive conditionals that govern how the class behaves according to the current values of the class\'s fields.'
    ],
    pros: [
      'Single Responsibility Principle: organize the code related to particular states into separate classes.',
      'Open/Closed Principle: introduce new states without changing existing state classes or the context.',
      'Simplify the code of the context by eliminating bulky state machine conditionals.'
    ],
    cons: [
      'Applying the pattern can be overkill if a state machine has only a few states or rarely changes.'
    ],
    codeExample: `class Context;
class State {
protected:
    Context *context_;
public:
    virtual ~State() {}
    void set_context(Context *context) { this->context_ = context; }
    virtual void Handle1() = 0;
    virtual void Handle2() = 0;
};

class Context {
private:
    State *state_;
public:
    Context(State *state) : state_(nullptr) { this->TransitionTo(state); }
    ~Context() { delete state_; }
    void TransitionTo(State *state) {
        if (this->state_ != nullptr) delete this->state_;
        this->state_ = state;
        this->state_->set_context(this);
    }
    void Request1() { this->state_->Handle1(); }
};`
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
    whenToUse: [
      'When you want to use different variants of an algorithm within an object and be able to switch from one algorithm to another during runtime.',
      'When you have a lot of similar classes that only differ in the way they execute some behavior.'
    ],
    pros: [
      'Switch algorithms used inside an object at runtime.',
      'Isolate the implementation details of an algorithm from the code that uses it.',
      'Replace inheritance with composition.'
    ],
    cons: [
      'If you only have a couple of algorithms and they rarely change, no real reason to overcomplicate things with new classes.',
      'Clients must be aware of the differences between strategies.'
    ],
    codeExample: `class Strategy {
public:
    virtual ~Strategy() {}
    virtual std::string doAlgorithm(std::string_view data) const = 0;
};

class Context {
private:
    std::unique_ptr<Strategy> strategy_;
public:
    explicit Context(std::unique_ptr<Strategy> &&strategy = {}) : strategy_(std::move(strategy)) {}
    void set_strategy(std::unique_ptr<Strategy> &&strategy) { strategy_ = std::move(strategy); }
    void doSomeBusinessLogic() const {
        if (strategy_) {
            std::string result = strategy_->doAlgorithm("data");
            std::cout << result << "\\n";
        }
    }
};`
  },
  {
    id: 'command',
    name: 'Command',
    category: PatternCategory.BEHAVIORAL,
    description: 'Turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request\'s execution, and support undoable operations.',
    whenToUse: [
      'When you want to parameterize objects with operations.',
      'When you want to queue operations, schedule their execution, or execute them remotely.',
      'When you want to implement reversible operations (Undo/Redo).'
    ],
    pros: [
      'Single Responsibility Principle: decouple classes that invoke operations from classes that perform these operations.',
      'Open/Closed Principle: you can introduce new commands without breaking existing client code.',
      'You can implement undo/redo and assemble complex commands into a composite.'
    ],
    cons: [
      'The code may become more complicated since you\'re introducing a whole new layer between senders and receivers.'
    ],
    codeExample: `class Command {
public:
    virtual ~Command() {}
    virtual void Execute() const = 0;
};

class SimpleCommand : public Command {
private:
    std::string pay_load_;
public:
    explicit SimpleCommand(std::string pay_load) : pay_load_(pay_load) {}
    void Execute() const override {
        std::cout << "SimpleCommand: Processing (" << pay_load_ << ")\\n";
    }
};

class Receiver {
public:
    void DoSomething(const std::string &a) {
        std::cout << "Receiver: Working on (" << a << ")\\n";
    }
};

class ComplexCommand : public Command {
private:
    Receiver *receiver_;
public:
    ComplexCommand(Receiver *receiver) : receiver_(receiver) {}
    void Execute() const override {
        this->receiver_->DoSomething("Complex Tasks");
    }
};`
  },
  {
    id: 'template-method',
    name: 'Template Method',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.',
    whenToUse: [
      'When you want to let clients extend only particular steps of an algorithm, but not the whole algorithm or its structure.',
      'When you have several classes that contain almost identical algorithms with some minor differences.'
    ],
    pros: [
      'You can let clients override only certain parts of a large algorithm, making them less affected by changes that happen to other parts.',
      'You can pull duplicate code into a superclass.'
    ],
    cons: [
      'Some clients may be limited by the provided skeleton of an algorithm.',
      'Violates Liskov Substitution Principle if steps are suppressed in subclasses.'
    ],
    codeExample: `class AbstractClass {
public:
    void TemplateMethod() const {
        this->BaseOperation1();
        this->RequiredOperations1();
        this->BaseOperation2();
        this->Hook1();
    }
protected:
    void BaseOperation1() const { std::cout << "Standard Step 1\\n"; }
    void BaseOperation2() const { std::cout << "Standard Step 2\\n"; }
    virtual void RequiredOperations1() const = 0;
    virtual void Hook1() const {} // Optional step
};

class ConcreteClass1 : public AbstractClass {
protected:
    void RequiredOperations1() const override {
        std::cout << "ConcreteClass1 implementation\\n";
    }
};`
  },
  {
    id: 'visitor',
    name: 'Visitor',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you separate algorithms from the objects on which they operate.',
    whenToUse: [
      'When you need to perform an operation on all elements of a complex object structure (e.g., an object tree).',
      'When a helper class has a set of behaviors that doesn\'t fit its main responsibility.'
    ],
    pros: [
      'Open/Closed Principle: you can introduce a new behavior that can work with objects of different classes without changing these classes.',
      'Single Responsibility Principle: you can move multiple versions of the same behavior into the same class.',
      'A visitor object can accumulate some useful information while working with various objects.'
    ],
    cons: [
      'You need to update all visitors each time a class gets added to or removed from the element hierarchy.',
      'Visitors might lack the necessary access to the private fields and methods of the elements that they\'re supposed to work with.'
    ],
    codeExample: `class ConcreteComponentA;
class Visitor {
public:
    virtual void VisitConcreteComponentA(const ConcreteComponentA *element) const = 0;
};

class Component {
public:
    virtual ~Component() {}
    virtual void Accept(Visitor *visitor) const = 0;
};

class ConcreteComponentA : public Component {
public:
    void Accept(Visitor *visitor) const override {
        visitor->VisitConcreteComponentA(this);
    }
    std::string ExclusiveMethodOfConcreteComponentA() const { return "A"; }
};

class ConcreteVisitor1 : public Visitor {
public:
    void VisitConcreteComponentA(const ConcreteComponentA *element) const override {
        std::cout << element->ExclusiveMethodOfConcreteComponentA() << " + ConcreteVisitor1\\n";
    }
};`
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).',
    whenToUse: [
      'When your collection has a complex data structure under the hood, but you want to hide its complexity from clients (either for convenience or security reasons).',
      'When you want to reduce duplication of the traversal code across your app.'
    ],
    pros: [
      'Single Responsibility Principle: you can clean up the client code and the collections by extracting bulky traversal algorithms into separate classes.',
      'Open/Closed Principle: you can implement new types of collections and iterators and pass them to existing code without breaking anything.',
      'You can traverse the same collection in parallel because each iterator object contains its own iteration state.'
    ],
    cons: [
      'Applying the pattern can be overkill if your app only works with simple collections.',
      'Using an iterator might be less efficient than going through elements of some specialized collections directly.'
    ],
    codeExample: `template <typename T, typename U>
class Iterator {
public:
    typedef typename std::vector<T>::iterator iter_type;
    Iterator(U *p_data, bool reverse = false) : m_p_data_(p_data) {
        m_it_ = m_p_data_->m_data_.begin();
    }
    void First() { m_it_ = m_p_data_->m_data_.begin(); }
    void Next() { m_it_++; }
    bool IsDone() { return (m_it_ == m_p_data_->m_data_.end()); }
    iter_type Current() { return m_it_; }
private:
    U *m_p_data_;
    iter_type m_it_;
};`
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: PatternCategory.STRUCTURAL,
    description: 'Lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors.',
    whenToUse: [
      'When you need to assign extra behaviors to objects at runtime without breaking the code that uses these objects.',
      'When it\'s awkward or impossible to extend an object\'s behavior using inheritance.'
    ],
    pros: [
      'Extend an object\'s behavior without making a new subclass.',
      'Add or remove responsibilities from an object at runtime.',
      'Combine several behaviors by wrapping an object into multiple decorators.'
    ],
    cons: [
      'It\'s hard to remove a specific wrapper from the wrappers stack.',
      'Hard to implement a decorator in such a way that its behavior doesn\'t depend on the order in the decorators stack.'
    ],
    codeExample: `class Component {
public:
    virtual ~Component() {}
    virtual std::string Operation() const = 0;
};

class ConcreteComponent : public Component {
public:
    std::string Operation() const override { return "ConcreteComponent"; }
};

class Decorator : public Component {
protected:
    Component* component_;
public:
    Decorator(Component* component) : component_(component) {}
    std::string Operation() const override { return this->component_->Operation(); }
};

class ConcreteDecoratorA : public Decorator {
public:
    ConcreteDecoratorA(Component* comp) : Decorator(comp) {}
    std::string Operation() const override {
        return "ConcreteDecoratorA(" + Decorator::Operation() + ")";
    }
};`
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows objects with incompatible interfaces to collaborate.',
    whenToUse: [
      'When you want to use some existing class, but its interface isn\'t compatible with the rest of your code.',
      'When you want to reuse several existing subclasses that lack some common functionality that can\'t be added to the superclass.'
    ],
    pros: [
      'Single Responsibility Principle: you separate the interface or data conversion code from the primary business logic.',
      'Open/Closed Principle: you can introduce new types of adapters into the program without breaking existing client code.'
    ],
    cons: [
      'The overall complexity of the code increases because you need to introduce a set of new interfaces and classes.'
    ],
    codeExample: `class Target {
public:
    virtual ~Target() = default;
    virtual std::string Request() const { return "Target: Default behavior."; }
};

class Adaptee {
public:
    std::string SpecificRequest() const { return ".eetpadA eht fo roivaheb laicepS"; }
};

class Adapter : public Target {
private:
    Adaptee *adaptee_;
public:
    Adapter(Adaptee *adaptee) : adaptee_(adaptee) {}
    std::string Request() const override {
        std::string to_reverse = this->adaptee_->SpecificRequest();
        std::reverse(to_reverse.begin(), to_reverse.end());
        return "Adapter: (TRANSLATED) " + to_reverse;
    }
};`
  }
];
