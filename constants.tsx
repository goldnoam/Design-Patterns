import { DesignPattern, PatternCategory } from './types';

export const DESIGN_PATTERNS: DesignPattern[] = [
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
    visualAidUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <memory>

class AbstractProductA {
public:
    virtual ~AbstractProductA() = default;
    virtual std::string UsefulFunctionA() const = 0;
};

class ConcreteProductA1 : public AbstractProductA {
public:
    std::string UsefulFunctionA() const override { return "Result of Product A1."; }
};

class AbstractFactory {
public:
    virtual std::unique_ptr<AbstractProductA> CreateProductA() const = 0;
    virtual ~AbstractFactory() = default;
};

class ConcreteFactory1 : public AbstractFactory {
public:
    std::unique_ptr<AbstractProductA> CreateProductA() const override {
        return std::make_unique<ConcreteProductA1>();
    }
};

int main() {
    ConcreteFactory1 factory;
    auto pA = factory.CreateProductA();
    std::cout << pA->UsefulFunctionA() << std::endl;
    return 0;
}`
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: PatternCategory.CREATIONAL,
    description: 'Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    whenToUse: [
      'When a class can\'t anticipate the exact class of objects it must create ahead of time.',
      'When you want to provide users of your library or framework with a way to extend its internal components.',
      'When the creation logic involves significant complexity that shouldn\'t be duplicated.'
    ],
    pros: [
      'Promotes Loose Coupling: Creator is decoupled from concrete product classes.',
      'Single Responsibility Principle: Move product creation code into one place.',
      'Open/Closed Principle: Introduce new products without breaking existing code.'
    ],
    cons: [
      'Increased Complexity: Requires many new subclasses.',
      'Subclass Requirement: Clients might have to subclass the Creator just to create a specific product.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <memory>
#include <string>

class Product {
public:
    virtual ~Product() {}
    virtual std::string Operation() const = 0;
};

class ConcreteProduct1 : public Product {
public:
    std::string Operation() const override { return "{Result of ConcreteProduct1}"; }
};

class Creator {
public:
    virtual ~Creator() {}
    virtual std::unique_ptr<Product> FactoryMethod() const = 0;

    std::string SomeOperation() const {
        std::unique_ptr<Product> product = this->FactoryMethod();
        return "Creator: Working with " + product->Operation();
    }
};

class ConcreteCreator1 : public Creator {
public:
    std::unique_ptr<Product> FactoryMethod() const override {
        return std::make_unique<ConcreteProduct1>();
    }
};

int main() {
    ConcreteCreator1 creator;
    std::cout << creator.SomeOperation() << std::endl;
    return 0;
}`
  },
  {
    id: 'singleton',
    name: 'Singleton',
    category: PatternCategory.CREATIONAL,
    description: 'Ensures a class has only one instance and provides a global point of access to it.',
    whenToUse: ['Database connections', 'Logger instances', 'Global configuration.'],
    pros: ['Controlled access', 'Lazy initialization.'],
    cons: ['Hard to unit test', 'Implicit dependencies.'],
    visualAidUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    codeExample: `class Singleton {
private:
    static Singleton* instance;
    Singleton() {}
public:
    Singleton(const Singleton&) = delete;
    void operator=(const Singleton&) = delete;
    static Singleton* getInstance() {
        if (!instance) instance = new Singleton();
        return instance;
    }
};
Singleton* Singleton::instance = nullptr;`
  },
  {
    id: 'builder',
    name: 'Builder',
    category: PatternCategory.CREATIONAL,
    description: 'Construct complex objects step by step.',
    whenToUse: ['Avoiding telescoping constructors', 'Complex configuration of objects.'],
    pros: ['Product can be varied internally', 'Better control over construction.'],
    cons: ['Requires separate ConcreteBuilder for each product type.'],
    visualAidUrl: 'https://images.unsplash.com/photo-1503387762-5929971d5d97?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <vector>

class Product {
public:
    std::vector<std::string> parts;
    void ListParts() const {
        std::cout << "Product parts: ";
        for (size_t i = 0; i < parts.size(); i++) {
            std::cout << parts[i] << (i == parts.size() - 1 ? "" : ", ");
        }
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
    Product* product;
public:
    ConcreteBuilder1() { this->Reset(); }
    ~ConcreteBuilder1() { delete product; }
    void Reset() { this->product = new Product(); }
    void ProducePartA() const override { this->product->parts.push_back("PartA1"); }
    void ProducePartB() const override { this->product->parts.push_back("PartB1"); }
    Product* GetProduct() {
        Product* result = this->product;
        this->Reset();
        return result;
    }
};

int main() {
    ConcreteBuilder1* builder = new ConcreteBuilder1();
    builder->ProducePartA();
    builder->ProducePartB();
    Product* p = builder->GetProduct();
    p->ListParts();
    delete p;
    delete builder;
    return 0;
}`
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: PatternCategory.CREATIONAL,
    description: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
    whenToUse: ['Reducing subclasses', 'Copying objects without coupling to concrete classes.'],
    pros: ['Cloning at runtime', 'Reduced subclassing.'],
    cons: ['Cloning complex objects with circular references is hard.'],
    visualAidUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <memory>
#include <unordered_map>

enum Type { PROTOTYPE_1 = 0, PROTOTYPE_2 };

class Prototype {
protected:
    std::string prototype_name_;
    float prototype_field_;
public:
    Prototype() {}
    Prototype(std::string name) : prototype_name_(name) {}
    virtual ~Prototype() {}
    virtual std::unique_ptr<Prototype> Clone() const = 0;
    virtual void Method(float field) {
        this->prototype_field_ = field;
        std::cout << "Method from " << prototype_name_ << " with field: " << field << "\\n";
    }
};

class ConcretePrototype1 : public Prototype {
public:
    ConcretePrototype1(std::string name, float field) : Prototype(name) {}
    std::unique_ptr<Prototype> Clone() const override {
        return std::make_unique<ConcretePrototype1>(*this);
    }
};

int main() {
    ConcretePrototype1 p1("P1", 50.0f);
    auto p2 = p1.Clone();
    p2->Method(100.0f);
    return 0;
}`
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows objects with incompatible interfaces to collaborate by wrapping an existing class with a new interface.',
    whenToUse: [
      'When you want to use an existing class, but its interface does not match the rest of your code.',
      'When you want to create a reusable class that cooperates with unrelated or unforeseen classes.',
      'When you need to use several existing subclasses, but it’s impractical to adapt their interface by subclassing every one.'
    ],
    pros: [
      'Single Responsibility Principle: You can separate the interface or data conversion code from the primary business logic.',
      'Open/Closed Principle: You can introduce new types of adapters without breaking the existing client code.'
    ],
    cons: [
      'Overall complexity of the code increases because you need to introduce a set of new interfaces and classes.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <algorithm>

class Target {
public:
    virtual ~Target() = default;
    virtual std::string Request() const {
        return "Target: The default target's behavior.";
    }
};

class Adaptee {
public:
    std::string SpecificRequest() const {
        return ".eetpadA eht fo roivaheb laicepS";
    }
};

class Adapter : public Target {
private:
    Adaptee* adaptee_;
public:
    Adapter(Adaptee* adaptee) : adaptee_(adaptee) {}
    std::string Request() const override {
        std::string to_reverse = this->adaptee_->SpecificRequest();
        std::reverse(to_reverse.begin(), to_reverse.end());
        return "Adapter: (TRANSLATED) " + to_reverse;
    }
};

int main() {
    Adaptee* adaptee = new Adaptee;
    Adapter* adapter = new Adapter(adaptee);
    std::cout << adapter->Request() << "\\n";
    delete adaptee;
    delete adapter;
    return 0;
}`
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: PatternCategory.STRUCTURAL,
    description: 'Decouples an abstraction from its implementation so that the two can vary independently. This pattern is particularly useful when both the abstraction and its implementation should be extensible by subclassing.',
    whenToUse: [
      'When you want to avoid a permanent binding between an abstraction and its implementation.',
      'When both abstractions and their implementations should be extensible by subclassing.',
      'When changes in the implementation of an abstraction should have no impact on clients.'
    ],
    pros: [
      'Separation of interface and implementation.',
      'Improved extensibility: You can extend abstraction and implementation hierarchies independently.',
      'Hiding implementation details from clients.'
    ],
    cons: [
      'Increased complexity: You might make the code more complicated by applying the pattern to a highly cohesive class.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>

class Device {
public:
    virtual ~Device() = default;
    virtual bool isEnabled() const = 0;
    virtual void enable() = 0;
    virtual void disable() = 0;
};

class TV : public Device {
    bool on = false;
public:
    bool isEnabled() const override { return on; }
    void enable() override { on = true; }
    void disable() override { on = false; }
};

class RemoteControl {
protected:
    Device* device;
public:
    RemoteControl(Device* d) : device(d) {}
    virtual ~RemoteControl() = default;
    void togglePower() {
        if (device->isEnabled()) device->disable();
        else device->enable();
    }
};

int main() {
    TV myTv;
    RemoteControl remote(&myTv);
    remote.togglePower();
    std::cout << "TV is " << (myTv.isEnabled() ? "ON" : "OFF") << "\\n";
    return 0;
}`
  },
  {
    id: 'composite',
    name: 'Composite',
    category: PatternCategory.STRUCTURAL,
    description: 'Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.',
    whenToUse: [
      'When you want to represent part-whole hierarchies of objects.',
      'When you want clients to be able to ignore the difference between compositions of objects and individual objects.'
    ],
    pros: [
      'Simplifies client code: Clients can treat all objects in the composite structure uniformly.',
      'Easier to add new types of components.'
    ],
    cons: [
      'Can make your design overly general: It can be hard to restrict the components of a composite.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <vector>
#include <string>
#include <memory>

class Component {
public:
    virtual ~Component() = default;
    virtual std::string Operation() const = 0;
    virtual void Add(std::shared_ptr<Component> c) {}
};

class Leaf : public Component {
public:
    std::string Operation() const override { return "Leaf"; }
};

class Composite : public Component {
    std::vector<std::shared_ptr<Component>> children;
public:
    void Add(std::shared_ptr<Component> c) override { children.push_back(c); }
    std::string Operation() const override {
        std::string res = "Branch(";
        for (const auto& c : children) {
            res += c->Operation() + (c == children.back() ? "" : "+");
        }
        return res + ")";
    }
};

int main() {
    auto tree = std::make_shared<Composite>();
    tree->Add(std::make_shared<Leaf>());
    auto branch = std::make_shared<Composite>();
    branch->Add(std::make_shared<Leaf>());
    tree->Add(branch);
    std::cout << "Result: " << tree->Operation() << std::endl;
    return 0;
}`
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: PatternCategory.STRUCTURAL,
    description: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
    whenToUse: [
      'To add responsibilities to individual objects dynamically and transparently.',
      'For responsibilities that can be withdrawn.',
      'When extension by subclassing is impractical.'
    ],
    pros: [
      'More flexibility than static inheritance.',
      'Avoids feature-laden classes high up in the hierarchy.',
      'You can wrap an object multiple times.'
    ],
    cons: [
      'A decorator and its component aren\'t identical.',
      'Lots of little objects.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1544787210-282aa39531ee?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <memory>

class Component {
public:
    virtual ~Component() = default;
    virtual std::string Operation() const = 0;
};

class ConcreteComponent : public Component {
public:
    std::string Operation() const override { return "ConcreteComponent"; }
};

class Decorator : public Component {
protected:
    std::unique_ptr<Component> component;
public:
    Decorator(std::unique_ptr<Component> c) : component(std::move(c)) {}
    std::string Operation() const override { return component->Operation(); }
};

class ConcreteDecoratorA : public Decorator {
public:
    ConcreteDecoratorA(std::unique_ptr<Component> c) : Decorator(std::move(c)) {}
    std::string Operation() const override {
        return "ConcreteDecoratorA(" + Decorator::Operation() + ")";
    }
};

int main() {
    auto simple = std::make_unique<ConcreteComponent>();
    auto decorated = std::make_unique<ConcreteDecoratorA>(std::move(simple));
    std::cout << "Client: " << decorated->Operation() << std::endl;
    return 0;
}`
  },
  {
    id: 'facade',
    name: 'Facade',
    category: PatternCategory.STRUCTURAL,
    description: 'Provides a simplified interface to a library, a framework, or any other complex set of classes.',
    whenToUse: [
      'When you want to provide a simple interface to a complex subsystem.',
      'When there are many dependencies between clients and implementation classes of an abstraction.',
      'When you want to layer your subsystems.'
    ],
    pros: [
      'Isolates clients from subsystem components.',
      'Promotes weak coupling between subsystem and its clients.',
      'Simplifies usage of complex APIs.'
    ],
    cons: [
      'A facade can become a "god object" coupled to all classes of an app.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>

class Subsystem1 {
public:
    std::string Operation1() const { return "Subsystem1: Ready!\\n"; }
    std::string OperationN() const { return "Subsystem1: Go!\\n"; }
};

class Subsystem2 {
public:
    std::string Operation1() const { return "Subsystem2: Get set!\\n"; }
    std::string OperationZ() const { return "Subsystem2: Fire!\\n"; }
};

class Facade {
protected:
    Subsystem1* s1;
    Subsystem2* s2;
public:
    Facade() { s1 = new Subsystem1; s2 = new Subsystem2; }
    ~Facade() { delete s1; delete s2; }
    std::string Operation() {
        std::string result = "Facade initializes subsystems:\\n";
        result += s1->Operation1();
        result += s2->Operation1();
        result += "Facade orders subsystems to perform action:\\n";
        result += s1->OperationN();
        result += s2->OperationZ();
        return result;
    }
};

int main() {
    Facade facade;
    std::cout << facade.Operation();
    return 0;
}`
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: PatternCategory.STRUCTURAL,
    description: 'Use sharing to support large numbers of fine-grained objects efficiently by sharing common parts of state between multiple objects.',
    whenToUse: [
      'When an application uses a large number of objects.',
      'When storage costs are high because of the sheer quantity of objects.',
      'When most object state can be made extrinsic.'
    ],
    pros: [
      'Reduces total memory footprint.',
      'Centralizes control of shared state.'
    ],
    cons: [
      'May introduce run-time costs for computing extrinsic state.',
      'Increased complexity of implementation.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <unordered_map>

struct SharedState {
    std::string brand;
    std::string model;
    SharedState(std::string b, std::string m) : brand(b), model(m) {}
};

class Flyweight {
    SharedState* shared_state;
public:
    Flyweight(SharedState* s) : shared_state(s) {}
    void Operation(const std::string& owner) const {
        std::cout << "Owner: " << owner << " Brand: " << shared_state->brand << "\\n";
    }
};

class FlyweightFactory {
    std::unordered_map<std::string, Flyweight> flyweights;
public:
    Flyweight& GetFlyweight(std::string brand, std::string model) {
        std::string key = brand + "_" + model;
        if (flyweights.find(key) == flyweights.end()) {
            flyweights.insert({key, Flyweight(new SharedState(brand, model))});
        }
        return flyweights.at(key);
    }
};

int main() {
    FlyweightFactory factory;
    auto& f1 = factory.GetFlyweight("Tesla", "Model S");
    f1.Operation("Elon");
    return 0;
}`
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: PatternCategory.STRUCTURAL,
    description: 'Provides a surrogate or placeholder for another object to control access to it. A proxy controls access to the original object, allowing you to perform actions either before or after the request reaches the target.',
    whenToUse: [
      'Lazy Initialization (Virtual Proxy): When you have a heavyweight service object that is expensive to maintain.',
      'Access Control (Protection Proxy): When you want only specific clients to be able to use the service object.',
      'Local Execution of a Remote Service (Remote Proxy): When the service object is located on a remote server.',
      'Logging Requests (Logging Proxy): When you want to keep a history of requests to the service object.'
    ],
    pros: [
      'You can control the service object without clients knowing about it.',
      'You can manage the lifecycle of the service object when clients don\'t care about it.',
      'The proxy works even if the service object isn\'t ready or is not available.',
      'Open/Closed Principle: You can introduce new proxies without changing the service or clients.'
    ],
    cons: [
      'The code may become more complicated since you need to introduce new classes.',
      'The response from the service might get delayed.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <memory>

class Subject {
public:
    virtual ~Subject() {}
    virtual void Request() const = 0;
};

class RealSubject : public Subject {
public:
    void Request() const override {
        std::cout << "RealSubject: Handling Request.\\n";
    }
};

class Proxy : public Subject {
private:
    mutable std::unique_ptr<RealSubject> real_subject_;

    bool CheckAccess() const {
        std::cout << "Proxy: Checking access prior to firing a real request.\\n";
        return true;
    }

    void LogAccess() const {
        std::cout << "Proxy: Logging the time of request.\\n";
    }

public:
    Proxy() : real_subject_(nullptr) {}

    void Request() const override {
        if (this->CheckAccess()) {
            if (!this->real_subject_) {
                this->real_subject_ = std::make_unique<RealSubject>();
            }
            this->real_subject_->Request();
            this->LogAccess();
        }
    }
};

int main() {
    Proxy proxy;
    proxy.Request();
    return 0;
}`
  },
  {
    id: 'observer',
    name: 'Observer',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
    whenToUse: [
      'When an abstraction has two aspects, one dependent on the other.',
      'When a change to one object requires changing others, and you don\'t know how many objects need to be changed.',
      'When an object should be able to notify other objects without making assumptions about who these objects are.'
    ],
    pros: [
      'Abstract coupling between Subject and Observer.',
      'Support for broadcast-style communication.'
    ],
    cons: [
      'Unexpected updates: Observers have no knowledge of each other and can be blind to the cost of changing the Subject.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <list>
#include <string>

class IObserver {
public:
    virtual ~IObserver() {}
    virtual void Update(const std::string &message_from_subject) = 0;
};

class ISubject {
public:
    virtual ~ISubject() {}
    virtual void Attach(IObserver *observer) = 0;
    virtual void Detach(IObserver *observer) = 0;
    virtual void Notify() = 0;
};

class Subject : public ISubject {
    std::list<IObserver *> list_observer_;
    std::string message_;
public:
    void Attach(IObserver *observer) override { list_observer_.push_back(observer); }
    void Detach(IObserver *observer) override { list_observer_.remove(observer); }
    void Notify() override {
        for (auto observer : list_observer_) observer->Update(message_);
    }
    void CreateMessage(std::string message = "Empty") {
        this->message_ = message;
        Notify();
    }
};

class Observer : public IObserver {
    std::string message_from_subject_;
public:
    void Update(const std::string &message_from_subject) override {
        message_from_subject_ = message_from_subject;
        std::cout << "Observer received message: " << message_from_subject_ << "\\n";
    }
};

int main() {
    Subject *subject = new Subject;
    Observer *observer1 = new Observer;
    subject->Attach(observer1);
    subject->CreateMessage("Hello World!");
    delete observer1;
    delete subject;
    return 0;
}`
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
    whenToUse: [
      'When many related classes differ only in their behavior.',
      'When you need different variants of an algorithm.',
      'When an algorithm uses data that clients shouldn\'t know about.'
    ],
    pros: [
      'Families of related algorithms.',
      'An alternative to subclassing.',
      'Elimination of conditional statements.'
    ],
    cons: [
      'Clients must be aware of different Strategies.',
      'Communication overhead between Strategy and Context.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1522071823991-b5ae77c4740e?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <memory>
#include <string>

class Strategy {
public:
    virtual ~Strategy() = default;
    virtual std::string DoAlgorithm(std::string data) const = 0;
};

class Context {
    std::unique_ptr<Strategy> strategy_;
public:
    Context(std::unique_ptr<Strategy> strategy = {}) : strategy_(std::move(strategy)) {}
    void set_strategy(std::unique_ptr<Strategy> strategy) { strategy_ = std::move(strategy); }
    void DoSomeBusinessLogic() const {
        if (strategy_) {
            std::string result = strategy_->DoAlgorithm("data");
            std::cout << result << "\\n";
        }
    }
};

class ConcreteStrategyA : public Strategy {
public:
    std::string DoAlgorithm(std::string data) const override { return "Strategy A: " + data; }
};

int main() {
    Context context(std::make_unique<ConcreteStrategyA>());
    context.DoSomeBusinessLogic();
    return 0;
}`
  },
  {
    id: 'state',
    name: 'State',
    category: PatternCategory.BEHAVIORAL,
    description: 'Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.',
    whenToUse: [
      'When an object\'s behavior depends on its state, and it must change its behavior at run-time depending on that state.',
      'When operations have large, multipart conditional statements that depend on the object\'s state.'
    ],
    pros: [
      'Localization of state-specific behavior.',
      'It makes state transitions explicit.'
    ],
    cons: [
      'Can be overkill if a state machine has only a few states.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <memory>

class Context;

class State {
public:
    virtual ~State() = default;
    virtual void Handle(Context *context) = 0;
};

class Context {
    std::unique_ptr<State> state_;
public:
    Context(std::unique_ptr<State> state) : state_(std::move(state)) {}
    void TransitionTo(std::unique_ptr<State> state) {
        state_ = std::move(state);
    }
    void Request() {
        state_->Handle(this);
    }
};

class ConcreteStateA : public State {
public:
    void Handle(Context *context) override;
};

class ConcreteStateB : public State {
public:
    void Handle(Context *context) override {
        std::cout << "ConcreteStateB handles request and wants to change state.\\n";
    }
};

void ConcreteStateA::Handle(Context *context) {
    std::cout << "ConcreteStateA handles request and changes state to B.\\n";
    context->TransitionTo(std::make_unique<ConcreteStateB>());
}

int main() {
    Context context(std::make_unique<ConcreteStateA>());
    context.Request();
    context.Request();
    return 0;
}`
  },
  {
    id: 'agentic',
    name: 'Agentic Pattern',
    category: PatternCategory.BEHAVIORAL,
    description: 'An autonomous entity that encapsulates decision-making logic, maintaining its own lifecycle and state to achieve specific goals.',
    whenToUse: [
      'When building autonomous systems (AI, robots, self-healing services).',
      'When you need complex background entities that react to environment changes independently.'
    ],
    pros: [
      'Encapsulates complex goal-oriented logic.',
      'Promotes high autonomy and decoupling from the main system loop.',
      'Easier to model entities with persistent internal memory and reasoning.'
    ],
    cons: [
      'Can be difficult to synchronize with global state.',
      'Potential for high resource consumption if many agents run concurrently.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Agent {
public:
    virtual ~Agent() = default;
    virtual void perceive(const std::string& environment) = 0;
    virtual void decide() = 0;
    virtual void act() = 0;
};

class AutonomousWorker : public Agent {
    std::string internalState;
    std::string plan;
public:
    void perceive(const std::string& env) override {
        internalState = "Observed: " + env;
    }
    void decide() override {
        plan = "Action for " + internalState;
    }
    void act() override {
        std::cout << "Agent acting: " << plan << std::endl;
    }
};

int main() {
    auto myAgent = std::make_unique<AutonomousWorker>();
    myAgent->perceive("low battery");
    myAgent->decide();
    myAgent->act();
    return 0;
}`
  },
  {
    id: 'fire-and-forget',
    name: 'Fire and Forget',
    category: PatternCategory.BEHAVIORAL,
    description: 'Executes a task asynchronously without the caller needing to track its completion or receive a return value.',
    whenToUse: [
      'For non-critical background tasks like logging, analytics, or secondary notifications.',
      'When you want to minimize latency in the main execution path.'
    ],
    pros: [
      'Non-blocking execution improves responsiveness.',
      'Simplifies caller code as no synchronization/joining is needed.'
    ],
    cons: [
      'No error reporting back to the caller.',
      'Can lead to resource leaks if the background task hangs indefinitely.'
    ],
    visualAidUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    codeExample: `#include <iostream>
#include <thread>
#include <future>
#include <functional>

void LogAnalytics(std::string data) {
    // Simulate some work
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << "Logged: " << data << std::endl;
}

// Fire and Forget implementation
void FireAndForget(std::function<void()> task) {
    // Detaching the thread allows it to run independently
    std::thread(task).detach();
}

int main() {
    std::cout << "Main: Starting fire and forget task..." << std::endl;
    
    FireAndForget([] {
        LogAnalytics("UserClickedButton_X");
    });
    
    std::cout << "Main: Moving on immediately!" << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    return 0;
}`
  }
];